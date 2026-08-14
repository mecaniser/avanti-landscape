"use client";

import { useMemo, useRef, useState } from "react";

type BlockKind = "heading" | "paragraph" | "bullets" | "numbered";
type ContentBlock = { id: string; kind: BlockKind; text: string };

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripHtml(value: string) {
  return decodeHtml(value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}

function blocksFromHtml(html: string): ContentBlock[] {
  const result: ContentBlock[] = [];
  const matcher = /<(h[1-3]|p|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(html))) {
    const tag = match[1].toLowerCase();
    const body = match[2];
    const kind: BlockKind = tag.startsWith("h") ? "heading" : tag === "ul" ? "bullets" : tag === "ol" ? "numbered" : "paragraph";
    const text = tag === "ul" || tag === "ol"
      ? body.split(/<\/li>/i).map((item) => stripHtml(item)).filter(Boolean).join("\n")
      : stripHtml(body);
    if (text) result.push({ id: `initial-${result.length}`, kind, text });
  }

  return result.length ? result : [{ id: "initial-0", kind: "paragraph", text: stripHtml(html) }];
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function htmlFromBlocks(blocks: ContentBlock[]) {
  return blocks
    .filter((block) => block.text.trim())
    .map((block) => {
      const text = escapeHtml(block.text.trim());
      if (block.kind === "heading") return `<h2>${text}</h2>`;
      if (block.kind === "bullets" || block.kind === "numbered") {
        const tag = block.kind === "bullets" ? "ul" : "ol";
        const items = text.split("\n").map((item) => item.trim()).filter(Boolean).map((item) => `<li>${item}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
      }
      return `<p>${text.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
}

const LABELS: Record<BlockKind, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  bullets: "Bullet list",
  numbered: "Numbered list",
};

export default function BlogBodyEditor({ initialHtml = "" }: { initialHtml?: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => blocksFromHtml(initialHtml));
  const nextId = useRef(blocks.length);
  const bodyHtml = useMemo(() => htmlFromBlocks(blocks), [blocks]);

  function changeBlock(id: string, text: string) {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, text } : block));
  }

  function addBlock(kind: BlockKind) {
    const id = `new-${nextId.current++}`;
    setBlocks((current) => [...current, { id, kind, text: "" }]);
    requestAnimationFrame(() => document.getElementById(`blog-block-${id}`)?.focus());
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setBlocks((current) => {
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeBlock(id: string) {
    setBlocks((current) => current.length === 1 ? [{ ...current[0], text: "" }] : current.filter((block) => block.id !== id));
  }

  return (
    <section className="blog-body-editor" aria-labelledby="blog-body-editor-title">
      <div className="blog-body-editor__head">
        <div>
          <label id="blog-body-editor-title">Post content</label>
          <p className="blog-body-editor__hint">Build the article with headings, paragraphs, and lists. Every field is directly editable.</p>
        </div>
        <div className="blog-body-editor__add" aria-label="Add content block">
          <button type="button" onClick={() => addBlock("paragraph")}>+ Paragraph</button>
          <button type="button" onClick={() => addBlock("heading")}>+ Heading</button>
          <button type="button" onClick={() => addBlock("bullets")}>+ List</button>
        </div>
      </div>

      <div className="blog-body-editor__blocks">
        {blocks.map((block, index) => (
          <div className="blog-body-editor__block" key={block.id}>
            <div className="blog-body-editor__block-head">
              <span>{LABELS[block.kind]}</span>
              <div>
                <button type="button" onClick={() => moveBlock(block.id, -1)} disabled={index === 0}>Move up</button>
                <button type="button" onClick={() => moveBlock(block.id, 1)} disabled={index === blocks.length - 1}>Move down</button>
                <button type="button" className="blog-body-editor__remove" onClick={() => removeBlock(block.id)}>Delete</button>
              </div>
            </div>
            {block.kind === "heading" ? (
              <input id={`blog-block-${block.id}`} type="text" value={block.text} onChange={(event) => changeBlock(block.id, event.target.value)} placeholder="Section heading" />
            ) : (
              <textarea
                id={`blog-block-${block.id}`}
                value={block.text}
                onChange={(event) => changeBlock(block.id, event.target.value)}
                rows={block.kind === "paragraph" ? 4 : 3}
                placeholder={block.kind === "paragraph" ? "Write a paragraph…" : "One item per line"}
              />
            )}
          </div>
        ))}
      </div>
      <input type="hidden" name="body" value={bodyHtml} />
    </section>
  );
}
