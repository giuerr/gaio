/**
 * GAIO — DOCX Export Module
 *
 * Generates properly formatted Word documents from Gaio's text output.
 * Legal documents with clause numbering, definitions, signature blocks,
 * headers/footers, page numbering.
 *
 * Depends on: npm package "docx"
 */

'use strict';

let Document, Packer, Paragraph, TextRun, Header, Footer,
    AlignmentType, HeadingLevel, PageNumber, NumberFormat,
    TabStopPosition, TabStopType, BorderStyle, ShadingType,
    TableOfContents, StyleLevel, UnderlineType, Tab,
    convertInchesToTwip, LevelFormat, PageBreak;

try {
  ({
    Document, Packer, Paragraph, TextRun, Header, Footer,
    AlignmentType, HeadingLevel, PageNumber, NumberFormat,
    TabStopPosition, TabStopType, BorderStyle, ShadingType,
    TableOfContents, StyleLevel, UnderlineType, Tab,
    convertInchesToTwip, LevelFormat, PageBreak,
  } = require('docx'));
} catch (_) {
  // docx not installed — DOCX export will be unavailable but agent still starts
}
const fs = require('fs');
const path = require('path');

// ── DOCUMENT STYLES ──────────────────────────────────────────────────────────

const DOCUMENT_STYLES = {
  formal: {
    id: 'formal',
    label: 'Formal Legal',
    description: 'For LPAs, SPAs, facility agreements — traditional legal formatting',
    font: 'Times New Roman',
    fontSize: 22, // half-points: 22 = 11pt
    headingFont: 'Times New Roman',
    headingSize: 28,
    lineSpacing: 276, // 1.15 line spacing in twips (240 * 1.15)
    allCaps: true,
    titleSize: 36,
    executionClause: 'IN WITNESS WHEREOF',
    includeWitness: false,
  },
  commercial: {
    id: 'commercial',
    label: 'Commercial',
    description: 'For NDAs, advisory agreements — lighter formatting',
    font: 'Calibri',
    fontSize: 22,
    headingFont: 'Calibri',
    headingSize: 26,
    lineSpacing: 276,
    allCaps: false,
    titleSize: 32,
    executionClause: 'IN WITNESS WHEREOF',
    includeWitness: false,
  },
  regulatory: {
    id: 'regulatory',
    label: 'Regulatory',
    description: 'For compliance manuals, applications — structured form-like',
    font: 'Calibri',
    fontSize: 22,
    headingFont: 'Calibri',
    headingSize: 26,
    lineSpacing: 276,
    allCaps: false,
    titleSize: 30,
    executionClause: 'CERTIFICATION',
    includeWitness: false,
  },
  correspondence: {
    id: 'correspondence',
    label: 'Correspondence',
    description: 'For engagement letters, mandate letters — letter format',
    font: 'Calibri',
    fontSize: 22,
    headingFont: 'Calibri',
    headingSize: 24,
    lineSpacing: 276,
    allCaps: false,
    titleSize: 28,
    executionClause: 'Yours faithfully',
    includeWitness: false,
  },
};

// Map doc types to style presets
const DOC_TYPE_STYLE_MAP = {
  lpa: 'formal', spa: 'formal', sha: 'formal', llc_oa: 'formal',
  facility_agreement: 'formal', security_agreement: 'formal',
  sub_agreement: 'formal', side_letter: 'formal', carry_plan: 'formal',
  gp_oa: 'formal', co_invest: 'formal', ppm: 'formal',
  nda: 'commercial', advisory_agreement: 'commercial', mou: 'commercial',
  term_sheet: 'commercial', mandate_letter: 'commercial',
  compliance_manual: 'regulatory', aml_policy: 'regulatory',
  regulatory_application: 'regulatory', kyc_policy: 'regulatory',
  engagement_letter: 'correspondence', opinion_letter: 'correspondence',
  comfort_letter: 'correspondence',
};

// ── JURISDICTION DISCLAIMERS ─────────────────────────────────────────────────

const JURISDICTION_DISCLAIMERS = {
  cayman: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the Cayman Islands. Recipients should seek independent legal counsel qualified to advise on Cayman Islands law before relying on or acting upon its contents.',
  bvi: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the British Virgin Islands. Recipients should seek independent legal counsel qualified to advise on BVI law before relying on or acting upon its contents.',
  luxembourg: 'This document has been prepared for informational purposes and does not constitute legal advice under Luxembourg law. Recipients should seek independent legal counsel qualified to advise on Luxembourg law, including the applicable provisions of the law of 10 August 1915 on commercial companies, as amended, before relying on or acting upon its contents.',
  delaware: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the State of Delaware or the United States. Recipients should seek independent legal counsel qualified to advise on Delaware law before relying on or acting upon its contents.',
  england: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of England and Wales. Recipients should seek independent legal counsel qualified to advise on English law before relying on or acting upon its contents.',
  jersey: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the Bailiwick of Jersey. Recipients should seek independent legal counsel qualified to advise on Jersey law before relying on or acting upon its contents.',
  guernsey: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the Bailiwick of Guernsey. Recipients should seek independent legal counsel qualified to advise on Guernsey law before relying on or acting upon its contents.',
  ireland: 'This document has been prepared for informational purposes and does not constitute legal advice under Irish law. Recipients should seek independent legal counsel qualified to advise on Irish law before relying on or acting upon its contents.',
  singapore: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of Singapore. Recipients should seek independent legal counsel qualified to advise on Singapore law before relying on or acting upon its contents.',
  hongkong: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the Hong Kong Special Administrative Region. Recipients should seek independent legal counsel qualified to advise on Hong Kong law before relying on or acting upon its contents.',
  uae: 'This document has been prepared for informational purposes and does not constitute legal advice under the laws of the United Arab Emirates or the DIFC. Recipients should seek independent legal counsel qualified to advise on UAE law before relying on or acting upon its contents.',
  default: 'This document has been prepared for informational purposes only and does not constitute legal advice. Recipients should seek independent legal counsel before relying on or acting upon its contents. No attorney-client relationship is created by the distribution of this document.',
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

function resolveStyle(docType) {
  const styleKey = DOC_TYPE_STYLE_MAP[docType] || 'formal';
  return { ...DOCUMENT_STYLES[styleKey] };
}

/**
 * Parse markdown-like content into structured sections.
 * Splits on ## headers, handles numbered clauses, definitions.
 */
function parseContent(content) {
  if (!content || typeof content !== 'string') return [];

  const lines = content.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      if (current) sections.push(current);
      current = { title: headerMatch[1].trim(), paragraphs: [] };
      continue;
    }
    if (!current) {
      current = { title: '', paragraphs: [] };
    }
    current.paragraphs.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

/**
 * Parse a paragraph line into TextRun elements, handling bold (**text**) and
 * definition markers ("Term" means...).
 */
function parseInlineFormatting(text, style) {
  const runs = [];
  if (!text) return runs;

  // Split on bold markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      runs.push(new TextRun({
        text: part.slice(2, -2),
        bold: true,
        font: style.font,
        size: style.fontSize,
      }));
    } else if (part.length > 0) {
      // Detect definition patterns: "Term" means
      const defParts = part.split(/("([^"]+)"\s+means)/g);
      if (defParts.length > 1) {
        for (let i = 0; i < defParts.length; i++) {
          if (defParts[i] && defParts[i].match(/^"[^"]+"\s+means$/)) {
            runs.push(new TextRun({
              text: defParts[i],
              bold: true,
              font: style.font,
              size: style.fontSize,
            }));
          } else if (defParts[i] && !defParts[i].match(/^[^"]+$/)) {
            // skip the capture group content
          } else if (defParts[i]) {
            runs.push(new TextRun({
              text: defParts[i],
              font: style.font,
              size: style.fontSize,
            }));
          }
        }
      } else {
        runs.push(new TextRun({
          text: part,
          font: style.font,
          size: style.fontSize,
        }));
      }
    }
  }
  return runs;
}

/**
 * Convert a section's paragraphs into docx Paragraph objects.
 */
function buildParagraphs(paragraphs, style) {
  const result = [];
  for (const line of paragraphs) {
    const trimmed = line.trim();
    if (trimmed === '') {
      result.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Sub-heading (### level)
    const subHeadMatch = trimmed.match(/^###\s+(.+)/);
    if (subHeadMatch) {
      result.push(new Paragraph({
        children: [new TextRun({
          text: subHeadMatch[1],
          bold: true,
          font: style.headingFont,
          size: style.headingSize - 2,
        })],
        spacing: { before: 240, after: 120 },
      }));
      continue;
    }

    // Clause numbering detection: lines starting with number patterns
    const clauseMatch = trimmed.match(/^(\d+(?:\.\d+)*\.?)\s+(.+)/);
    if (clauseMatch) {
      const level = (clauseMatch[1].match(/\./g) || []).length;
      const indent = level * 360; // twips per indent level
      result.push(new Paragraph({
        children: [
          new TextRun({
            text: clauseMatch[1] + '  ',
            bold: level === 0,
            font: style.font,
            size: style.fontSize,
          }),
          ...parseInlineFormatting(clauseMatch[2], style),
        ],
        indent: { left: indent },
        spacing: { after: 120, line: style.lineSpacing },
      }));
      continue;
    }

    // Lettered sub-clauses: (a), (b), (i), (ii)
    const letterMatch = trimmed.match(/^\(([a-z]|[ivxlc]+)\)\s+(.+)/i);
    if (letterMatch) {
      result.push(new Paragraph({
        children: [
          new TextRun({
            text: `(${letterMatch[1]})  `,
            font: style.font,
            size: style.fontSize,
          }),
          ...parseInlineFormatting(letterMatch[2], style),
        ],
        indent: { left: 720 },
        spacing: { after: 100, line: style.lineSpacing },
      }));
      continue;
    }

    // Bracketed placeholder: [PLACEHOLDER]
    const hasPlaceholder = trimmed.includes('[') && trimmed.includes(']');

    // Regular paragraph
    const runs = parseInlineFormatting(trimmed, style);
    if (hasPlaceholder) {
      // Highlight placeholders
      for (const run of runs) {
        const txt = run.root && run.root[1] && run.root[1].text;
        // We just keep them as-is; the bold/inline handling covers it
      }
    }

    result.push(new Paragraph({
      children: runs,
      spacing: { after: 120, line: style.lineSpacing },
    }));
  }
  return result;
}

// ── SIGNATURE BLOCK ──────────────────────────────────────────────────────────

/**
 * Generate a signature block section.
 * @param {Array<{name: string, role: string}>} parties
 * @param {Object} [opts]
 * @param {string} [opts.executionClause] — opening clause text
 * @param {boolean} [opts.includeWitness] — add witness block (English law deeds)
 * @param {Object} [opts.style] — style overrides
 * @returns {Paragraph[]}
 */
function generateSignatureBlock(parties, opts = {}) {
  try {
    const style = opts.style || DOCUMENT_STYLES.formal;
    const executionClause = opts.executionClause || style.executionClause || 'IN WITNESS WHEREOF';
    const includeWitness = opts.includeWitness != null ? opts.includeWitness : style.includeWitness;
    const safeParties = Array.isArray(parties) && parties.length > 0
      ? parties
      : [{ name: '[PARTY NAME]', role: '[ROLE]' }];

    const paragraphs = [];

    // Execution clause
    paragraphs.push(new Paragraph({
      children: [new TextRun({
        text: `${executionClause}, the parties hereto have executed this agreement as of the date first written above.`,
        font: style.font,
        size: style.fontSize,
      })],
      spacing: { before: 480, after: 360 },
    }));

    for (const party of safeParties) {
      const pName = (party && party.name) || '[PARTY NAME]';
      const pRole = (party && party.role) || '[ROLE]';

      // Party header
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: pRole.toUpperCase(),
          bold: true,
          font: style.font,
          size: style.fontSize,
        })],
        spacing: { before: 360, after: 120 },
      }));

      // Signature line
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: '________________________________________',
          font: style.font,
          size: style.fontSize,
        })],
        spacing: { before: 360, after: 60 },
      }));

      // Name
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: 'Name: ', font: style.font, size: style.fontSize }),
          new TextRun({ text: pName, font: style.font, size: style.fontSize }),
        ],
        spacing: { after: 60 },
      }));

      // Title
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: 'Title: ', font: style.font, size: style.fontSize }),
          new TextRun({ text: '[TITLE]', font: style.font, size: style.fontSize, italics: true }),
        ],
        spacing: { after: 60 },
      }));

      // Date
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: 'Date: ', font: style.font, size: style.fontSize }),
          new TextRun({ text: '[DATE]', font: style.font, size: style.fontSize, italics: true }),
        ],
        spacing: { after: 120 },
      }));

      // Witness block for deeds
      if (includeWitness) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: 'In the presence of:',
            font: style.font,
            size: style.fontSize,
            italics: true,
          })],
          spacing: { before: 240, after: 120 },
        }));

        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: '________________________________________',
            font: style.font,
            size: style.fontSize,
          })],
          spacing: { before: 240, after: 60 },
        }));

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: 'Witness Name: ', font: style.font, size: style.fontSize }),
            new TextRun({ text: '[WITNESS NAME]', font: style.font, size: style.fontSize, italics: true }),
          ],
          spacing: { after: 60 },
        }));

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: 'Witness Address: ', font: style.font, size: style.fontSize }),
            new TextRun({ text: '[WITNESS ADDRESS]', font: style.font, size: style.fontSize, italics: true }),
          ],
          spacing: { after: 60 },
        }));

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: 'Witness Occupation: ', font: style.font, size: style.fontSize }),
            new TextRun({ text: '[WITNESS OCCUPATION]', font: style.font, size: style.fontSize, italics: true }),
          ],
          spacing: { after: 120 },
        }));
      }
    }

    return paragraphs;
  } catch (err) {
    console.error('[GAIO docx-export] generateSignatureBlock error:', err.message);
    return [new Paragraph({
      children: [new TextRun({ text: '[SIGNATURE BLOCK — generation error]', italics: true })],
    })];
  }
}

// ── SCHEDULE / APPENDIX ──────────────────────────────────────────────────────

/**
 * Generate a schedule/appendix section.
 * @param {string} title — schedule title
 * @param {string} content — schedule content (markdown-like)
 * @param {Object} [style] — style overrides
 * @returns {Paragraph[]}
 */
function generateSchedule(title, content, style) {
  try {
    const s = style || DOCUMENT_STYLES.formal;
    const safeTitle = (title && typeof title === 'string') ? title : 'Schedule';
    const safeContent = (content && typeof content === 'string') ? content : '[Schedule content to be inserted]';

    const paragraphs = [];

    // Page break before schedule
    paragraphs.push(new Paragraph({
      children: [new TextRun({ break: 1 })],
      pageBreakBefore: true,
    }));

    // Schedule title
    paragraphs.push(new Paragraph({
      children: [new TextRun({
        text: safeTitle.toUpperCase(),
        bold: true,
        font: s.headingFont,
        size: s.headingSize,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 240 },
    }));

    // Parse and add content
    const sections = parseContent(safeContent);
    if (sections.length === 0) {
      // Raw text, no sections
      const lines = safeContent.split('\n');
      paragraphs.push(...buildParagraphs(lines, s));
    } else {
      for (const section of sections) {
        if (section.title) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({
              text: section.title,
              bold: true,
              font: s.headingFont,
              size: s.headingSize - 2,
            })],
            spacing: { before: 240, after: 120 },
          }));
        }
        paragraphs.push(...buildParagraphs(section.paragraphs, s));
      }
    }

    return paragraphs;
  } catch (err) {
    console.error('[GAIO docx-export] generateSchedule error:', err.message);
    return [new Paragraph({
      children: [new TextRun({ text: `[${title || 'Schedule'} — generation error]`, italics: true })],
    })];
  }
}

// ── DISCLAIMER ───────────────────────────────────────────────────────────────

/**
 * Generate jurisdiction-appropriate disclaimer text.
 * @param {string} jurisdiction — jurisdiction ID
 * @returns {string}
 */
function addDisclaimer(jurisdiction) {
  if (!jurisdiction || typeof jurisdiction !== 'string') {
    return JURISDICTION_DISCLAIMERS.default;
  }
  const key = jurisdiction.toLowerCase().replace(/[\s_-]/g, '');
  return JURISDICTION_DISCLAIMERS[key] || JURISDICTION_DISCLAIMERS.default;
}

// ── MAIN EXPORT: generateDocx ────────────────────────────────────────────────

/**
 * Generate a formatted Word document from Gaio output.
 *
 * @param {Object} options
 * @param {string} options.title — document title
 * @param {string} [options.docType] — Gaio doc type ID
 * @param {string} [options.jurisdiction] — jurisdiction ID
 * @param {Array<{name:string, role:string}>} [options.parties] — contracting parties
 * @param {string} [options.date] — document date
 * @param {string} options.content — document text content
 * @param {string} options.outputPath — where to save the .docx
 * @param {string} [options.styleOverride] — force a style key
 * @param {boolean} [options.includeSignatureBlock=true]
 * @param {boolean} [options.includeDisclaimer=true]
 * @param {Array<{title:string, content:string}>} [options.schedules] — appendices
 * @returns {Promise<string>} — the file path of the generated document
 */
async function generateDocx(options = {}) {
  try {
    // ── Validate inputs ────────────────────────────────────────────────
    if (!options.content && !options.title) {
      throw new Error('generateDocx requires at least "content" or "title"');
    }
    if (!options.outputPath) {
      throw new Error('generateDocx requires "outputPath"');
    }

    const title = options.title || 'Untitled Document';
    const docType = options.docType || '';
    const jurisdiction = options.jurisdiction || '';
    const parties = Array.isArray(options.parties) ? options.parties : [];
    const docDate = options.date || new Date().toISOString().split('T')[0];
    const content = options.content || '';
    const outputPath = options.outputPath;
    const includeSignatureBlock = options.includeSignatureBlock !== false;
    const includeDisclaimer = options.includeDisclaimer !== false;
    const schedules = Array.isArray(options.schedules) ? options.schedules : [];

    // ── Resolve style ──────────────────────────────────────────────────
    const styleKey = options.styleOverride || DOC_TYPE_STYLE_MAP[docType] || 'formal';
    const style = { ...(DOCUMENT_STYLES[styleKey] || DOCUMENT_STYLES.formal) };

    // ── Build document children ────────────────────────────────────────
    const children = [];

    // -- Title page --
    children.push(new Paragraph({
      children: [],
      spacing: { before: 2400 },
    }));

    children.push(new Paragraph({
      children: [new TextRun({
        text: style.allCaps ? title.toUpperCase() : title,
        bold: true,
        font: style.headingFont,
        size: style.titleSize,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
    }));

    // Document type subtitle
    if (docType) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: docType.replace(/_/g, ' ').toUpperCase(),
          font: style.font,
          size: style.fontSize + 2,
          color: '666666',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }));
    }

    // Parties on title page
    if (parties.length > 0) {
      children.push(new Paragraph({ spacing: { before: 360 } }));
      children.push(new Paragraph({
        children: [new TextRun({
          text: 'between',
          font: style.font,
          size: style.fontSize,
          italics: true,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }));

      for (let i = 0; i < parties.length; i++) {
        const p = parties[i];
        children.push(new Paragraph({
          children: [new TextRun({
            text: (p.name || '[PARTY NAME]').toUpperCase(),
            bold: true,
            font: style.font,
            size: style.fontSize + 2,
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({
            text: `(as ${p.role || 'Party ' + (i + 1)})`,
            font: style.font,
            size: style.fontSize,
            italics: true,
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
        }));
        if (i < parties.length - 1) {
          children.push(new Paragraph({
            children: [new TextRun({
              text: 'and',
              font: style.font,
              size: style.fontSize,
              italics: true,
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
          }));
        }
      }
    }

    // Date
    children.push(new Paragraph({
      children: [new TextRun({
        text: `Dated: ${docDate}`,
        font: style.font,
        size: style.fontSize,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 120 },
    }));

    // Jurisdiction line
    if (jurisdiction) {
      children.push(new Paragraph({
        children: [new TextRun({
          text: `Governing Law: ${jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1)}`,
          font: style.font,
          size: style.fontSize,
          italics: true,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }));
    }

    // Page break after title page
    children.push(new Paragraph({
      children: [],
      pageBreakBefore: true,
    }));

    // -- Table of Contents placeholder --
    children.push(new Paragraph({
      children: [new TextRun({
        text: 'TABLE OF CONTENTS',
        bold: true,
        font: style.headingFont,
        size: style.headingSize,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    }));

    children.push(new Paragraph({
      children: [new TextRun({
        text: '[Table of Contents — update field after opening in Word: right-click > Update Field]',
        font: style.font,
        size: style.fontSize,
        italics: true,
        color: '999999',
      })],
      spacing: { after: 240 },
    }));

    // Page break after TOC
    children.push(new Paragraph({
      children: [],
      pageBreakBefore: true,
    }));

    // -- Document body --
    const sections = parseContent(content);
    if (sections.length === 0 && content.trim()) {
      // No markdown sections detected — treat as raw text
      const lines = content.split('\n');
      children.push(...buildParagraphs(lines, style));
    } else {
      for (const section of sections) {
        if (section.title) {
          children.push(new Paragraph({
            children: [new TextRun({
              text: style.allCaps ? section.title.toUpperCase() : section.title,
              bold: true,
              font: style.headingFont,
              size: style.headingSize,
            })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 200 },
          }));
        }
        children.push(...buildParagraphs(section.paragraphs, style));
      }
    }

    // -- Signature block --
    if (includeSignatureBlock) {
      children.push(...generateSignatureBlock(parties, {
        style,
        executionClause: style.executionClause,
        includeWitness: style.includeWitness,
      }));
    }

    // -- Schedules --
    for (const sched of schedules) {
      children.push(...generateSchedule(sched.title, sched.content, style));
    }

    // -- Disclaimer --
    if (includeDisclaimer) {
      children.push(new Paragraph({ spacing: { before: 480 } }));
      children.push(new Paragraph({
        children: [new TextRun({
          text: 'DISCLAIMER',
          bold: true,
          font: style.font,
          size: style.fontSize - 2,
          color: '888888',
        })],
        spacing: { after: 60 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({
          text: addDisclaimer(jurisdiction),
          font: style.font,
          size: style.fontSize - 4,
          italics: true,
          color: '888888',
        })],
        spacing: { after: 120 },
      }));
    }

    // ── Assemble document ──────────────────────────────────────────────
    const doc = new Document({
      creator: 'TABULARUM — Gaio (General Counsel)',
      title: title,
      description: `${docType ? docType.toUpperCase() + ' — ' : ''}Generated by Gaio`,
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  font: style.font,
                  size: style.fontSize - 4,
                  color: '999999',
                }),
                new TextRun({ text: '\t' }),
                new TextRun({
                  text: 'CONFIDENTIAL — DRAFT',
                  bold: true,
                  font: style.font,
                  size: style.fontSize - 4,
                  color: 'CC0000',
                }),
              ],
              alignment: AlignmentType.LEFT,
            })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              children: [
                new TextRun({
                  text: 'Generated by TABULARUM — Gaio | ',
                  font: style.font,
                  size: style.fontSize - 6,
                  color: 'AAAAAA',
                }),
                new TextRun({
                  children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                  font: style.font,
                  size: style.fontSize - 6,
                  color: 'AAAAAA',
                }),
              ],
              alignment: AlignmentType.CENTER,
            })],
          }),
        },
        children,
      }],
    });

    // ── Write to disk ──────────────────────────────────────────────────
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

    console.log(`[GAIO docx-export] Document written: ${outputPath} (${buffer.length} bytes)`);
    return outputPath;

  } catch (err) {
    console.error('[GAIO docx-export] generateDocx error:', err.message);
    throw err;
  }
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  generateDocx,
  generateSignatureBlock,
  generateSchedule,
  addDisclaimer,
  DOCUMENT_STYLES,
  DOC_TYPE_STYLE_MAP,
  JURISDICTION_DISCLAIMERS,
};
