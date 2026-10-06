
// Tells agent WHEN to start using the skill
---
name: erd-generator
description: Generates and validates ERD database schemas into SVG files when requested to design an ERD, data model, or architecure diagram.
---

// Skill name for AI to read
# ERD Generator Skill
 
 // Figure out tables, PK & FK BEFORE writing any code.
1. **Parse Requirements:** Identify primary keys (PK), foregin keys (FK), entities, and cardinalities from requirements in domains.
// Agent finds out exact file name & path to know where to write.
2. **Write Schema:** Write the drafted Mermaid syntax directly to `docs/architecture/schema.mmd`[cite: 10].
// Gives commands to execute node scripts
3. **Render Diagram:** Execute `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`, and re-run (up to 3 retries)[cite: 10].
// Tells agent it's nextmove after a mistake is made or if a rendering error is made it reads the error, fixes the file, and tries again
4. **Self-Correction Loop:** If execution fails with  `SYNTAX_ERROR`, parse the error trace, adjust the Mermaid syntax in `docs/architecture/schema.mmd`, and re-run (up to 3 retries)[cite: 10].
// Displays results based on how agent is told to
5. **Final Output:** Present raw Mermaid block to user and reference the generated image asset path (`docs/architecture/erd.svg`)[cite: 10].