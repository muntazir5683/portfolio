"""Generate the Technical & On-Page SEO Audit PDF (no site files modified for SEO)."""

from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parents[1] / "docs" / "SEO-Audit-Report.pdf"


def sanitize(text: str) -> str:
    return (
        text.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2026", "...")
        .replace("\u2192", "->")
        .replace("\u00d7", "x")
        .replace("\u2260", "!=")
    )


class AuditPDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 116, 139)
        self.cell(0, 6, "SEO Audit - Syed Muntazir Mortgage AI Portfolio", align="L")
        self.ln(8)

    def footer(self) -> None:
        self.set_y(-14)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 8, f"Page {self.page_no()}/{{nb}}", align="C")


def add_title(pdf: AuditPDF, text: str) -> None:
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(15, 23, 42)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 9, sanitize(text))
    pdf.ln(2)


def add_h2(pdf: AuditPDF, text: str) -> None:
    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(15, 23, 42)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 7, sanitize(text))
    pdf.ln(1)


def add_h3(pdf: AuditPDF, text: str) -> None:
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(30, 41, 59)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 6, sanitize(text))
    pdf.ln(1)


def add_body(pdf: AuditPDF, text: str) -> None:
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5.5, sanitize(text))
    pdf.ln(1)


def add_bullet(pdf: AuditPDF, text: str, indent: float = 4) -> None:
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.set_x(pdf.l_margin + indent)
    usable = pdf.w - pdf.r_margin - pdf.get_x()
    pdf.multi_cell(usable, 5.5, f"- {sanitize(text)}")


def status_line(pdf: AuditPDF, status: str, text: str) -> None:
    colors = {
        "Pass": (16, 185, 129),
        "Warning": (245, 158, 11),
        "Missing": (239, 68, 68),
    }
    r, g, b = colors.get(status, (100, 116, 139))
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(r, g, b)
    pdf.cell(22, 5.5, status.upper())
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(51, 65, 85)
    usable = pdf.w - pdf.r_margin - pdf.get_x()
    pdf.multi_cell(usable, 5.5, sanitize(text))


def table_row(pdf: AuditPDF, cols: list[str], widths: list[float], header: bool = False) -> None:
    cols = [sanitize(c) for c in cols]
    pdf.set_font("Helvetica", "B" if header else "", 8)
    if header:
        pdf.set_text_color(15, 23, 42)
    else:
        pdf.set_text_color(51, 65, 85)
    # Estimate height from tallest cell
    line_h = 4.5
    heights = []
    for col, w in zip(cols, widths):
        heights.append(max(line_h, pdf.get_string_width(col) / (w - 1) * line_h + line_h))
    h = min(max(heights), 18)
    y0 = pdf.get_y()
    x0 = pdf.get_x()
    if y0 + h > pdf.h - 20:
        pdf.add_page()
        y0 = pdf.get_y()
        x0 = pdf.get_x()
    for i, (col, w) in enumerate(zip(cols, widths)):
        pdf.set_xy(x0 + sum(widths[:i]), y0)
        if header:
            pdf.set_fill_color(241, 245, 249)
            pdf.rect(x0 + sum(widths[:i]), y0, w, h, style="F")
        pdf.multi_cell(w, line_h, col)
    pdf.set_y(y0 + h)


def build() -> Path:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = AuditPDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_left_margin(16)
    pdf.set_right_margin(16)

    add_title(pdf, "Technical & On-Page SEO Audit")
    add_body(
        pdf,
        "Scope: Astro + React + Tailwind portfolio (single route src/pages/index.astro). "
        "Audit-only — no files were modified for this report. Generated for review before fixes.",
    )
    add_body(
        pdf,
        "Verdict: Strong niche foundation (meta, JSON-LD, sitemap, primary H1). Gaps: title/"
        "description length, OG image quality, heading coverage for some secondaries, leftover "
        "off-niche sandbox/proof copy, and no real content images/alt text.",
    )

    # Section 1
    add_h2(pdf, "1. Meta Tags & Head Configuration")
    add_body(
        pdf,
        "Single layout: src/layouts/BaseLayout.astro | One indexable page: src/pages/index.astro",
    )
    w = [28, 22, 120]
    table_row(pdf, ["Check", "Status", "Evidence"], w, header=True)
    rows = [
        ["html lang=en", "Pass", "BaseLayout.astro L131"],
        ["Viewport", "Pass", "L134 width=device-width, initial-scale=1"],
        ["Charset", "Pass", "L133 utf-8"],
        ["Canonical", "Pass", "L139 -> https://syedmuntazir.dev/ (astro.config site)"],
        ["Robots index/follow", "Pass", "L150-151"],
        ["Title + OG/Twitter synced", "Pass", "L143, L156-157, L165-166"],
        ["Meta description", "Pass", "L144 / L14"],
        ["Title length 50-60", "Warning", "69 chars (target 50-60) — L11-12"],
        ["Desc length 140-160", "Warning", "170 chars (target 140-160) — L13-14"],
        ["og:image quality", "Warning", "Defaults to /favicon.svg — poor social preview"],
        ["og dimensions / twitter:site", "Missing", "Not set in BaseLayout.astro"],
        ["Multi-page meta", "Pass", "N/A — one page, one layout"],
    ]
    for r in rows:
        table_row(pdf, r, w)

    pdf.ln(3)
    add_h3(pdf, "Exact strings in use")
    add_bullet(
        pdf,
        'Title (69): "Custom AI Agents for Mortgage Brokers & Lending Teams | Syed Muntazir"',
    )
    add_bullet(
        pdf,
        'Description (170): "Custom AI agent development services for US mortgage brokers. '
        "Automate inbound calls with an AI voice agent, parse W-2s & bank statements, and "
        'pre-qualify borrowers 24/7."',
    )
    add_bullet(pdf, "Canonical: new URL(Astro.url.pathname, siteOrigin) — BaseLayout L22-23, L139")

    # Section 2
    add_h2(pdf, "2. Target Keyword Alignment (US Mortgage AI Niche)")
    add_h3(pdf, "Exact-phrase inventory (case-insensitive)")
    w2 = [95, 18, 57]
    table_row(pdf, ["Keyword", "Count", "Placement"], w2, header=True)
    for row in [
        ["ai agents for mortgage brokers", "9", "H1, H2, meta, JSON-LD, body"],
        ["ai voice agent to answer calls for mortgage brokers", "4", "meta, JSON-LD, service tagline/body"],
        ["best ai lending agent for mortgage brokers", "2", "meta keywords + Loan Doc body only"],
        ["custom ai agent development services", "8", "eyebrow, H2s, meta, JSON-LD"],
        ["custom agentic ai development services", "4", "Services intro, body, meta/JSON-LD"],
    ]:
        table_row(pdf, row, w2)

    add_h3(pdf, "Heading / body matrix")
    status_line(
        pdf,
        "Pass",
        'Primary in H1 (Hero.astro L24-26) and H2 (ProjectShowcase.tsx L624-626)',
    )
    status_line(
        pdf,
        "Warning",
        "Voice-agent phrase not in H1/H2 — tagline/body only (portfolioData.ts L299-301)",
    )
    status_line(
        pdf,
        "Warning",
        '"best ai lending agent..." thin — L148 meta + portfolioData.ts L314 only',
    )
    status_line(
        pdf,
        "Pass",
        "custom ai agent development services in Services H2 (L16-18) and contact H2 (index L49)",
    )
    status_line(
        pdf,
        "Warning",
        "custom agentic... body only (Services.astro L20); not exact H2",
    )

    add_h3(pdf, "Other heading / copy issues")
    status_line(pdf, "Pass", "Single H1 — Hero.astro L24-26 (no duplicate H1)")
    status_line(
        pdf,
        "Warning",
        "Assistant drawer H2 when open — AiPortfolioAssistant.tsx L226-228",
    )
    status_line(
        pdf,
        "Warning",
        "Off-niche sandbox (pharmacy/WhatsApp/PakGovJobs) — portfolioData.ts ~L630-968; #automations",
    )
    status_line(
        pdf,
        "Warning",
        'Proof H2 "SellerShield, Smart Page Monitor & more" — ProjectShowcase.tsx L648-650',
    )
    status_line(
        pdf,
        "Warning",
        'Generic experience: "web apps, scrapers, chatbots..." — portfolioData.ts L378',
    )
    status_line(
        pdf,
        "Warning",
        'Contact brief footer: "portfolio contact form" — SmartContactEstimator.tsx L238',
    )
    status_line(
        pdf,
        "Missing",
        "Keyword-bearing image alts — motifs aria-hidden (ProjectShowcase.tsx L146); no content <img>",
    )

    # Section 3
    add_h2(pdf, "3. Structured Data (JSON-LD Schema)")
    status_line(pdf, "Pass", "JSON-LD in <head> — BaseLayout.astro L170-171")
    status_line(pdf, "Pass", '@context https://schema.org — L28; @graph with 4 nodes L29-126')

    add_h3(pdf, "Configured @type and key properties")
    add_bullet(
        pdf,
        "Person (#person) L31-43 — name, url, jobTitle, description, email, sameAs",
    )
    add_bullet(
        pdf,
        "ProfessionalService (#service) L45-98 — name, url, description, image, provider, "
        "areaServed (US), audience, serviceType[], hasOfferCatalog with Voice Lead Receptionist, "
        "Loan Document & W-2 Parser, LOS/CRM Automation",
    )
    add_bullet(
        pdf,
        "SoftwareApplication (#software) L100-116 — name, applicationCategory, operatingSystem, "
        'description, offers (price "0" USD), creator, provider',
    )
    add_bullet(
        pdf,
        "WebSite (#website) L118-125 — url, name, description, publisher, inLanguage",
    )
    status_line(
        pdf,
        "Warning",
        'SoftwareApplication price:"0" may look like free-app markup — L107-112',
    )
    status_line(
        pdf,
        "Missing",
        'Exact schema phrase for "best ai lending agent for mortgage brokers" '
        '(L106 uses "tooling" variant)',
    )

    # Section 4
    add_h2(pdf, "4. Crawlability, Indexing & Build Health")
    add_h3(pdf, "Crawl / index")
    status_line(pdf, "Pass", "public/robots.txt — Allow: / + Sitemap URL L1-4")
    status_line(pdf, "Pass", "@astrojs/sitemap in astro.config.mjs L4, L13; site L12")
    status_line(pdf, "Pass", "Sitemap lists https://syedmuntazir.dev/ (single page)")
    status_line(pdf, "Pass", '<link rel="sitemap"> — BaseLayout.astro L140')

    add_h3(pdf, "Internal anchors")
    w3 = [30, 28, 50, 42]
    table_row(pdf, ["Nav label", "href", "Target id", "Status"], w3, header=True)
    for row in [
        ["Services", "#services", "Services.astro L12", "Pass"],
        ["Systems", "#projects", "index.astro L22", "Pass (label != id)"],
        ["Pipelines", "#automations", "index.astro L28", "Pass"],
        ["Experience", "#experience", "SkillsExperience L19", "Pass"],
        ["Contact", "#contact", "index.astro L45", "Pass"],
        ["#systems id", "—", "not defined", "Missing"],
    ]:
        table_row(pdf, row, w3)

    add_h3(pdf, "Images / Core Web Vitals")
    status_line(pdf, "Missing", "Content images — only public/favicon.svg")
    status_line(pdf, "Pass", "No client:load; client:visible x3 + client:idle assistant (index.astro)")
    status_line(
        pdf,
        "Warning",
        "Google Fonts third-party (non-blocking media=print trick) — BaseLayout L174-180",
    )
    status_line(pdf, "Pass", "No heavy LCP raster hero; no analytics/GTM blocking scripts")
    status_line(
        pdf,
        "Warning",
        "Four React islands still large when scrolled into view (Showcase, Sandbox, Estimator, Assistant)",
    )
    status_line(pdf, "Pass", "prefers-reduced-motion handled in global.css")

    # Consolidated
    pdf.add_page()
    add_h2(pdf, "Consolidated Checklist (fix-ready)")

    add_h3(pdf, "Pass")
    for t in [
        "lang, viewport, charset, canonical, robots — BaseLayout.astro L131-151",
        "Title / description / OG / Twitter present and aligned — L143-168",
        "Single H1 with primary keyword — Hero.astro L24-26",
        "Primary + several secondaries in visible copy + meta keywords",
        "JSON-LD @graph (Person, ProfessionalService, SoftwareApplication, WebSite)",
        "robots.txt + @astrojs/sitemap + site URL",
        "Section anchors #services|#projects|#automations|#experience|#contact resolve",
        "Hydration: client:visible / client:idle only (no client:load)",
    ]:
        add_bullet(pdf, t)

    add_h3(pdf, "Warning")
    for t in [
        "Title 69 chars > 50-60 — BaseLayout.astro L11-12",
        "Description 170 chars > 140-160 — L13-14",
        "OG/Twitter image is favicon SVG — L19, L160, L167",
        "Voice-agent phrase not in H1/H2 — portfolioData.ts L299-301",
        '"best ai lending agent..." only 2x — L148, portfolioData.ts L314',
        '"custom agentic..." not in an H2 — Services.astro L20',
        "Off-niche AutomationSandbox demos — portfolioData.ts workflows",
        "Proof H2 / experience copy still generalist",
        'SoftwareApplication price:"0" — BaseLayout.astro L107-112',
        "Assistant injects extra H2 when open — AiPortfolioAssistant.tsx L226-228",
    ]:
        add_bullet(pdf, t)

    add_h3(pdf, "Missing")
    for t in [
        "Dedicated OG image (e.g. public/og-mortgage-ai.png) + dimensions meta",
        'Exact schema phrase for "best ai lending agent for mortgage brokers"',
        "Keyword-bearing content image alt text (no content images exist)",
        'id="systems" if that slug is desired (currently #projects only)',
        "og:image:width / og:image:height / optional twitter:site",
    ]:
        add_bullet(pdf, t)

    add_h2(pdf, "Suggested fix priority (later pass)")
    add_body(
        pdf,
        "(1) Trim title/description to length targets. (2) Add real OG image. "
        "(3) Add one H2/H3 natural use of the voice-agent + best AI lending agent phrases. "
        "(4) Mortgage-align or demote sandbox/proof copy for SERP focus. "
        "(5) Soften/fix SoftwareApplication offer markup.",
    )

    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(100, 116, 139)
    pdf.multi_cell(
        0,
        5,
        "End of report. Review before applying fixes. Source: codebase inspection of "
        "D:\\aiDev\\portfolio (Astro + React + Tailwind).",
    )

    pdf.output(OUT)
    return OUT


if __name__ == "__main__":
    path = build()
    print(path)
