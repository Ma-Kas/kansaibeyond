import { Fragment, createElement } from 'react';
import {
  isRootNode,
  isHorizontalRuleNode,
  isImageBlockNode,
  isImageNode,
  isLinkNode,
  isParagraphNode,
  isTextNode,
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
        className: parsedNode.type,
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
        className: parsedNode.type,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isTextNode(input)) {
    // Render Blog Post Text in span
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      className: parsedNode.type,
      style: 'style' in parsedNode ? parsedNode.style : undefined,
      text: parsedNode.text,
    });
  } else if (isLinkNode(input)) {
    // Render Blog Post Link
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        className: parsedNode.type,
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
      className: parsedNode.type,
    });
  } else if (isImageBlockNode(input)) {
    // Render Blog Post Single Image Container
    const parsedNode = input;
    return createElement(
      keysToComponentMap[parsedNode.type],
      {
        key: crypto.randomUUID(),
        className: parsedNode.type,
      },
      'children' in parsedNode &&
        parsedNode.children.map((child) => constructComponentTree(child))
    );
  } else if (isImageNode(input)) {
    // Render Blog Post Image
    const parsedNode = input;
    return createElement(keysToComponentMap[parsedNode.type], {
      key: crypto.randomUUID(),
      className: parsedNode.type,
      src: parsedNode.src,
    });
  } else {
    // Other nodes not relevant to frontend render fragment (=nothing)
    return <Fragment key={crypto.randomUUID()} />;
  }
};

export default constructComponentTree;
