import { createApp, reactive, nextTick } from "./petite-vue.es.js";

const matrix = {
  // BEGIN-MATRIX
  // Debian
  bullseye: {
    2.2: "official-",
    2.4: "hdn+",
    2.5: "hdn+",
    2.6: "backports-|hdn+",
    2.7: "hdn+",
    2.8: "hdn+",
    "3.0": "hdn+",
    3.1: "hdn+",
  },
  bookworm: {
    2.6: "official-|hdn+",
    2.8: "hdn+",
    2.9: "hdn+",
    "3.0": "hdn+",
    3.1: "hdn+",
    3.2: "hdn+",
  },
  sid: { "3.0": "official+", 3.2: "experimental" },
  // Ubuntu
  xenial: { 1.8: "ppa+", "2.0": "ppa+" },
  bionic: {
    1.8: "official-|ppa+",
    1.9: "ppa+",
    "2.0": "ppa+",
    2.1: "ppa+",
    2.2: "ppa+",
    2.3: "ppa+",
    2.4: "ppa+",
    2.5: "ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
  },
  focal: {
    "2.0": "official-|ppa+",
    2.1: "ppa+",
    2.2: "ppa+",
    2.3: "ppa+",
    2.4: "ppa+",
    2.5: "ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
    2.8: "ppa+",
    2.9: "ppa+",
    "3.0": "ppa+",
  },
  jammy: {
    2.4: "official-|ppa+",
    2.5: "ppa+",
    2.6: "ppa+",
    2.7: "ppa+",
    2.8: "ppa+",
    2.9: "ppa+",
    "3.0": "ppa+",
  },
  noble: {
    2.8: "official-",
    2.9: "ppa+",
    "3.0": "ppa+",
    3.1: "ppa+",
    3.2: "ppa+",
  },
  oracular: { 2.9: "official-" },
  plucky: { "3.0": "official-" },
  // END-MATRIX
};

createApp({
  // Supported distributions
  distributions: {
    Debian: {
      bullseye: "Bullseye (11)",
      bookworm: "Bookworm (12)",
      sid: "Sid (unstable)",
    },
    Ubuntu: {
      xenial: "Xenial (16.04 LTS)",
      bionic: "Bionic (18.04 LTS)",
      focal: "Focal (20.04 LTS)",
      jammy: "Jammy (22.04 LTS)",
      noble: "Noble (24.04 LTS)",
      oracular: "Oracular (24.10)",
      plucky: "Plucky (25.04)",
    },
  },

  // HAProxy versions
  versions: {
    2.4: "2.4-stable (LTS)",
    2.6: "2.6-stable (LTS)",
    2.8: "2.8-stable (LTS)",
    "3.0": "3.0-stable (LTS)",
    3.1: "3.1-stable",
    3.2: "3.2-stable (LTS)",
  },

  // Helper function to build Debian repository URL
  debian(release, subrelease) {
    var suffix = "debian";
    var distribution = subrelease ? [release, subrelease].join("-") : release;
    return `http://deb.debian.org/${suffix} ${distribution}`;
  },

  // Selected versions
  selected: {},

  // Proposed solutions
  solutions() {
    const { distribution, release, version } = this.selected;
    if (!distribution || !release || !version) return [];

    const proposed = matrix[release]?.[version];
    const solutions = (proposed ?? "unavailable").split("|");
    const current = solutions.map((solution) => ({
      version: { "+": "latest", "-": "stable" }[solution.slice(-1)] ?? null,
      distribution: solution.replace(/\+|\-$/, ""),
      id: solution,
    }));
    return current;
  },

  // Put selection in URL
  updateLocation() {
    const { distribution, release, version } = this.selected;
    if (distribution && release && version) {
      window.location = `#distribution=${distribution}&release=${release}&version=${version}`;
    }
  },
  updateFromLocation() {
    const location = window.location.hash.slice(1).replace(/^\?+/, "");
    const { distribution, release, version } = Object.fromEntries(
      location.split("&").map((v) => v.split("=")),
    );
    if (distribution && release && version) {
      this.selected.distribution = distribution;
      this.selected.release = release;
      this.selected.version = version;
    }
  },
  mounted(el) {
    addEventListener("hashchange", this.updateFromLocation);
    this.updateFromLocation();
    nextTick(() => el.classList.add("js"));
  },
}).mount();
