export interface ImpactStory {
  id: string;
  title: string;
  agency: string;
  year: string;
  docketId: string;
  docketUrl: string;
  headline: string;
  summary: string;
  commentCount: string;
  outcome: string;
  quote: string;
  quoteAttribution: string;
}

export const impactStories: ImpactStory[] = [
  {
    id: "net-neutrality-2015",
    title: "Restoring Internet Freedom (Net Neutrality)",
    agency: "Federal Communications Commission",
    year: "2014-2015",
    docketId: "FCC-2014-0108",
    docketUrl: "https://www.regulations.gov/docket/FCC-2014-0108",
    headline: "A record 4 million public comments reshaped the internet as we know it.",
    summary:
      "When the FCC proposed new Open Internet rules, they expected a few thousand comments from telecom lawyers. Instead, they received nearly 4 million — the most public comments in U.S. regulatory history. Ordinary citizens, startups, and educators flooded the docket with personal stories about why an open internet mattered to them. The FCC's final order explicitly cited public comments in its legal reasoning, and the strongest net neutrality rules in history were adopted.",
    commentCount: "3.9 million",
    outcome:
      "FCC adopted the Open Internet Order (2015) classifying broadband as a Title II common carrier service. The rules banned blocking, throttling, and paid prioritization.",
    quote:
      "Without net neutrality, my rural telehealth clinic would lose its connection to urban specialists. My patients can't afford that.",
    quoteAttribution: "A rural healthcare provider's public comment, FCC Docket 14-28",
  },
  {
    id: "airline-refunds-2024",
    title: "Airline Ticket Refunds and Consumer Protections",
    agency: "Department of Transportation",
    year: "2022-2024",
    docketId: "DOT-OST-2022-0089",
    docketUrl: "https://www.regulations.gov/docket/DOT-OST-2022-0089",
    headline: "Consumer horror stories about cancelled flights became federal law.",
    summary:
      "During the COVID-19 pandemic, airlines cancelled millions of flights and offered vouchers instead of cash refunds. DOT proposed a rule requiring automatic cash refunds for cancelled or significantly delayed flights. Over 160,000 consumers submitted comments — sharing detailed stories of lost money, hours spent on hold, and broken promises. The agency read them. The final rule, adopted in April 2024, requires automatic refunds within 7 days for credit cards and 20 days for other payments.",
    commentCount: "160,000+",
    outcome:
      "DOT adopted the Final Rule on Airline Ticket Refunds (April 2024). Airlines must provide automatic cash refunds for cancellations, significant schedule changes, and significantly delayed baggage return.",
    quote:
      "I spent $2,400 on flights for my family's COVID-postponed reunion. The airline cancelled and gave me a voucher that expired before I could use it. I never got my money back.",
    quoteAttribution: "A consumer's public comment, DOT Docket DOT-OST-2022-0089",
  },
  {
    id: "waters-of-us-2019",
    title: "Definition of 'Waters of the United States' (Clean Water Act)",
    agency: "Environmental Protection Agency & Army Corps of Engineers",
    year: "2014-2019",
    docketId: "EPA-HQ-OW-2017-0203",
    docketUrl: "https://www.regulations.gov/docket/EPA-HQ-OW-2017-0203",
    headline: "Farmers, ranchers, and rural landowners changed the definition of 'water' in federal law.",
    summary:
      "The Clean Water Act applies to 'waters of the United States' — but for decades, nobody agreed on what that meant. When EPA proposed a broad definition covering seasonal streams and wetlands, farmers and ranchers flooded the docket with over 1 million comments. They described how the proposed rule would require permits for ditches and ponds on private land. The agency listened. The final Navigable Waters Protection Rule (2020) significantly narrowed the definition, excluding ephemeral streams and isolated wetlands.",
    commentCount: "1.1 million",
    outcome:
      "EPA adopted the Navigable Waters Protection Rule (2020) with a narrower definition. The rule was later revised again under the Biden administration — demonstrating that public comments influence policy across administrations.",
    quote:
      "Under the proposed rule, the drainage ditch behind my barn would be regulated as a 'water of the United States.' I'd need a federal permit just to clean it out after a storm.",
    quoteAttribution: "A farmer's public comment, EPA Docket EPA-HQ-OW-2017-0203",
  },
  {
    id: "fluoride-drinking-water-2024",
    title: "Fluoride in Drinking Water — EPA NRDC Petition Response",
    agency: "Environmental Protection Agency",
    year: "2024",
    docketId: "EPA-HQ-OPPT-2023-0342",
    docketUrl: "https://www.regulations.gov/docket/EPA-HQ-OPPT-2023-0342",
    headline: "A scientific petition from one nonprofit triggered a federal court order changing national water policy.",
    summary:
      "In 2017, the Fluoride Action Network and other groups petitioned EPA to ban the addition of fluoride to drinking water under the Toxic Substances Control Act, citing neurotoxicity studies. EPA denied the petition. The groups sued. In September 2024, a federal judge ordered EPA to regulate fluoride, finding that current levels pose an 'unreasonable risk' of reduced IQ in children. Public comments submitted during the rulemaking — including peer-reviewed studies — were cited directly in the court's opinion.",
    commentCount: "23,000+",
    outcome:
      "Federal court ordered EPA to begin rulemaking on fluoride in drinking water (September 2024). EPA is now developing proposed regulations.",
    quote:
      "The National Toxicology Program's systematic review found that higher fluoride exposure is consistently associated with lower IQ in children. This evidence cannot be ignored.",
    quoteAttribution: "Public comment citing NTP monograph, EPA Docket EPA-HQ-OPPT-2023-0342",
  },
];
