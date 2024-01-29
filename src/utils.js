export function removeAnnotation() {
  document.querySelectorAll(".highlight").forEach((highlight) => {
    const parent = highlight.parentNode;
    const textNode = document.createTextNode(highlight.textContent);
    parent.replaceChild(textNode, highlight);
    parent.normalize();
  });
}

export function checkIfAnnotationExists(range) {
  const highlighted = Array.from(document.querySelectorAll(".highlight"));
  return highlighted.some((h) => range.intersectsNode(h));
}

function calculateOffset(container, selectionOffset) {
  let offset = 0;
  function calculate(container) {
    if (container.previousSibling) {
      offset += container.previousSibling.textContent.length;
      calculate(container.previousSibling);
    } else {
      offset += selectionOffset;
    }
  }
  calculate(container);
  return offset;
}

function findParentIndex(container, selectionParent) {
  return Array.from(container.childNodes).findIndex(
    (child) => child === selectionParent
  );
}

export function getSelectionObject(container) {
  const selection = window.getSelection();

  if (selection.rangeCount === 0 || selection.isCollapsed) {
    throw new Error("No selection found");
  }

  const range = selection.getRangeAt(0);

  if (!range.intersectsNode(container)) {
    throw new Error("Selection is outside of the container");
  }

  if (checkIfAnnotationExists(range)) {
    throw new Error("Selection already highlighted");
  }

  const selectionObj = {
    startElement: findParentIndex(container, range.startContainer.parentNode),
    startCharacter: calculateOffset(range.startContainer, range.startOffset),
    endElement: findParentIndex(container, range.endContainer.parentNode),
    endCharacter: calculateOffset(range.endContainer, range.endOffset),
  };

  return selectionObj;
}
