import { isRootNode } from '../../../types/post-content-type-guards';

const constructComponentTree = (data: unknown) => {
  if (!isRootNode(data)) {
    return <></>;
  }
  const child = data.root.children.forEach((childNode) => {
    console.log(childNode);
  });
  return child;
};

export default constructComponentTree;
