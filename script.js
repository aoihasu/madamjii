let highestZ = 10;

class Paper {
  constructor() {
    this.paper = null;
    this.pointerId = null;
    this.startX = 0;
    this.startY = 0;
    this.startPaperX = 0;
    this.startPaperY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentX = 0;
    this.currentY = 0;
  }

  init(paper) {
    this.paper = paper;

    // Give each paper a slightly different starting angle.
    this.applyTransform();

    paper.addEventListener("pointerdown", (e) => {
      e.preventDefault();

      this.pointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startPaperX = this.currentX;
      this.startPaperY = this.currentY;

      paper.style.zIndex = highestZ++;

      if (paper.setPointerCapture) {
        paper.setPointerCapture(e.pointerId);
      }
    }, { passive: false });

    paper.addEventListener("pointermove", (e) => {
      if (this.pointerId !== e.pointerId) return;

      e.preventDefault();

      this.currentX = this.startPaperX + (e.clientX - this.startX);
      this.currentY = this.startPaperY + (e.clientY - this.startY);
      this.applyTransform();
    }, { passive: false });

    const release = (e) => {
      if (this.pointerId !== e.pointerId) return;
      this.pointerId = null;

      if (paper.releasePointerCapture) {
        try {
          paper.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    paper.addEventListener("pointerup", release);
    paper.addEventListener("pointercancel", release);
    paper.addEventListener("lostpointercapture", () => {
      this.pointerId = null;
    });

    // Prevent the browser image/context-menu behavior while interacting.
    paper.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  applyTransform() {
    this.paper.style.transform =
      `translate(calc(-50% + ${this.currentX}px), calc(-50% + ${this.currentY}px)) rotateZ(${this.rotation}deg)`;
  }
}

document.querySelectorAll(".paper").forEach((paper) => {
  new Paper().init(paper);
});
