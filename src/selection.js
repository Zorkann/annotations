// Split highlight node into three nodes: start, highlight, end
function createHighlightNode(textContent, start, end, currentOffset, position) {
  const startNode = document.createTextNode(
    textContent.substring(0, start - currentOffset)
  );
  const highlightNode = document.createElement("span");
  highlightNode.classList.add("highlight", ...position.split(" "));
  highlightNode.textContent = textContent.substring(
    start - currentOffset,
    end - currentOffset
  );
  const endNode = document.createTextNode(
    textContent.substring(end - currentOffset, textContent.length)
  );

  return { startNode, highlightNode, endNode };
}

// Find the node that contains the selection and wrap the selection with a highlight <span/>
function replaceNodeContentWithHighlight(node, start, end, position) {
  const childNodes = node.childNodes;
  let accumulatedOffset = 0;

  for (let i = 0; i < childNodes.length; i++) {
    const nodeElement = childNodes[i];
    const textContent = nodeElement.textContent;
    const isSelectionWithinNode =
      accumulatedOffset + textContent.length > start;

    if (isSelectionWithinNode) {
      const { startNode, highlightNode, endNode } = createHighlightNode(
        textContent,
        start,
        end,
        accumulatedOffset,
        position
      );
      nodeElement.replaceWith(startNode, highlightNode, endNode);

      break;
    }

    accumulatedOffset += textContent.length;
  }
}

export function renderAnnotation(
  container,
  { startElement, startCharacter, endElement, endCharacter }
) {
  const containerChildren = Array.from(container.childNodes);
  const elementsBetween = containerChildren.slice(startElement + 1, endElement);

  if (startElement === endElement) {
    return replaceNodeContentWithHighlight(
      containerChildren[startElement],
      startCharacter,
      endCharacter,
      "start end"
    );
  }

  replaceNodeContentWithHighlight(
    containerChildren[startElement],
    startCharacter,
    containerChildren[startElement].textContent.length,
    "start"
  );

  elementsBetween.forEach((element) => {
    replaceNodeContentWithHighlight(
      element,
      0,
      element.textContent.length,
      "middle"
    );
  });

  replaceNodeContentWithHighlight(
    containerChildren[endElement],
    0,
    endCharacter,
    "end"
  );
}
