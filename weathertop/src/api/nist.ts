import type { CveItem, Severity } from "../types/cve";
const baseUrl = "https://services.nvd.nist.gov/rest/json/cves/2.0"

type NvdCveResponse = {
    vulnerabilities: NvdVulnerability[];
};

type NvdVulnerability = {
    cve: {
        id: string;
        published: string;
        lastModified: string;
        descriptions: {
            lang: string;
            value: string;
        }[];
        metrics: {
            cvssMetricV31?: NvdCvssMetric[];
            cvssMetricV30?: NvdCvssMetric[];
            cvssMetricV2?: NvdCvssMetric[];
        };
        references: {
            referenceData?: {
                url: string;
            }[];
        }
        }
    };

type NvdCvssMetric = {
    cvssData: {
        baseScore: number;
        baseSeverity?: Severity;
    };
    baseSeverity?: Severity;
}

const getSeverity = (vulnerability: NvdVulnerability): Severity => {
    const metrics = vulnerability.cve.metrics;

    const severity =
        metrics?.cvssMetricV31?.[0]?.cvssData.baseSeverity ??
        metrics?.cvssMetricV30?.[0]?.cvssData.baseSeverity ??
        metrics?.cvssMetricV2?.[0]?.cvssData.baseSeverity ??
        "UNKNOWN";

    return severity;
}

const getScore = (vulnerability: NvdVulnerability): number | null => {
    const metrics = vulnerability.cve.metrics;

    const score =
        metrics?.cvssMetricV31?.[0]?.cvssData.baseScore ??
        metrics?.cvssMetricV30?.[0]?.cvssData.baseScore ??
        metrics?.cvssMetricV2?.[0]?.cvssData.baseScore ??
        null;

    return score;
};

const mapNvdvulnerability = (vulnerability: NvdVulnerability): CveItem => {
    const englishDescription =
    vulnerability.cve.descriptions?.find((description) => description.lang === 'en')?.value ??
    'No description available';

    const references =
    vulnerability.cve.references?.referenceData?.map((reference) => reference.url) ?? [];

    return {
        id: vulnerability.cve.id,
        description: englishDescription,
        published: vulnerability.cve.published,
        lastModified: vulnerability.cve.lastModified,
        severity: getSeverity(vulnerability),
        score: getScore(vulnerability),
        references: references
    };
}
export const getNistData = async(): Promise<CveItem[]> => {
    const response = await fetch(baseUrl);

    if(!response.ok) {
        throw new Error(`Failed to fetch data from NIST: ${response.statusText}`);
    }

    const data: NvdCveResponse = await response.json();

    return data.vulnerabilities.map(mapNvdvulnerability);
}

