import { Fragment, createElement } from 'react';
import {
  isRootNode,
  isHorizontalRuleNode,
  isImageBlockNode,
  isImageNode,
  isLinkNode,
  isParagraphNode,
  isHeadingNode,
  isTextNode,
  isListNode,
  isListItemNode,
  isCodeBlockNode,
  isCodeHighlightNode,
  isLineBreakNode,
  isQuoteNode,
  isImageGalleryBlockNode,
  isImageGalleryContainerNode,
} from '../../../types/post-content-type-guards';
import { keysToComponentMap } from './post-content-constants';

export const constructComponentTree = (input: unknown): JSX.Element => {
  if (isRootNode(input)) {
    // Render Blog Post Root
    const parsedNode = input.root;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isParagraphNode(input)) {
    // Render Blog Post Paragraph
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        paragraphNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isHeadingNode(input)) {
    // Render Blog Post Heading
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        headingNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isTextNode(input)) {
    // Render Blog Post Text in span
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      format: parsedNode.format,
      style: 'style' in parsedNode ? parsedNode.style : '',
      text: parsedNode.text,
    });
  } else if (isLinkNode(input)) {
    // Render Blog Post Link
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        url: parsedNode.url,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isHorizontalRuleNode(input)) {
    // Render Blog Post Horizontal Rule
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
    });
  } else if (isImageBlockNode(input)) {
    // Render Blog Post Single Image Container
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        imageBlockNode: parsedNode,
        alignment: parsedNode.alignment,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isImageNode(input)) {
    // Render Blog Post Image
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      src: parsedNode.src,
    });
  } else if (isImageGalleryBlockNode(input)) {
    // Render Blog Post Single Image Container
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        alignment: parsedNode.alignment,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isImageGalleryContainerNode(input)) {
    // Render Blog Post Single Image Container
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      containerNode: parsedNode,
    });
  } else if (isQuoteNode(input)) {
    // Render Blog Post List
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        quoteNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isListNode(input)) {
    // Render Blog Post List
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        listNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isListItemNode(input)) {
    // Render Blog Post List Item
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        listItemNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isCodeBlockNode(input)) {
    // Render Blog Code Block
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        format: parsedNode.format,
        indent: parsedNode.indent,
        codeBlockNode: parsedNode,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isCodeHighlightNode(input)) {
    // Render Content of Code Block
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      format: parsedNode.format,
      style: 'style' in parsedNode ? parsedNode.style : '',
      text: parsedNode.text,
    });
  } else if (isLineBreakNode(input)) {
    // Render Line Break

    return <br key={crypto.randomUUID()} />;
  } else {
    // Other nodes not relevant to frontend render fragment (=nothing)
    return <Fragment key={crypto.randomUUID()} />;
  }
};

export default constructComponentTree;
