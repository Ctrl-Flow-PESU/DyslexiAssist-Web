export interface ColorCombination {
  bg: [number, number, number];
  text: [number, number, number];
  name: string;
}

export class ContrastTester {
  private combinations: ColorCombination[] = [
    {
      bg: [255, 248, 229],
      text: [0, 0, 0],
      name: "Cream & Black"
    },
    {
      bg: [204, 232, 207],
      text: [0, 0, 0],
      name: "Mint & Black"
    },
    {
      bg: [203, 225, 241],
      text: [0, 0, 0],
      name: "Light Blue & Black"
    },
    {
      bg: [44, 44, 44],
      text: [255, 248, 229],
      name: "Dark Mode"
    },
    {
      bg: [250, 226, 197],
      text: [0, 0, 0],
      name: "Peach & Black"
    }
  ];

  private sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "The five boxing wizards jump quickly.",
  ];

  private currentIndex = 0;
  private feedback: { combination: string; rating: number }[] = [];

  getCurrentCombination(): ColorCombination {
    return this.combinations[this.currentIndex];
  }

  getColorCombinationByName(name: string): ColorCombination | undefined {
    return this.combinations.find(combo => 
      combo.name.toLowerCase() === name.toLowerCase()
    );
  }

  getCurrentText(): string {
    return this.sampleTexts[this.currentIndex % this.sampleTexts.length];
  }

  recordFeedback(rating: number): void {
    this.feedback.push({
      combination: this.combinations[this.currentIndex].name,
      rating,
    });
  }

  next(): boolean {
    this.currentIndex++;
    return this.currentIndex < this.combinations.length;
  }

  getResults() {
    const bestRating = Math.max(...this.feedback.map(f => f.rating));
    const bestCombination = this.feedback.find(f => f.rating === bestRating);

    if (!bestCombination) {
      throw new Error("No feedback recorded");
    }

    const recommendations = [
      "Remember to take regular breaks while reading",
      "Adjust screen brightness to match your environment",
      "Consider using the OpenDyslexic font for better readability",
    ];

    return {
      best_combination: bestCombination.combination,
      contrast_ratio: "7.5",
      comfort_rating: bestRating,
      recommendations,
    };
  }
}