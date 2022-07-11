import { createApp, reactive, nextTick } from "./petite-vue.es.js";

const matrix = {
  // BEGIN-MATRIX
  // Debian
  stretch: { 1.8: "hdn+", "2.0": "hdn+", 2.2: "hdn+" },
  buster: {
    1.8: "official-|hdn+",
    "2.0": "hdn+",
    2.2: "backports-|hdn+",
    2.3: "hdn+",
    2.4: "hdn+",
    2.5: "hdn+",
    2.6: "hdn+",
  },
  bullseye: {
    2.2: "official-",
    2.4: "backports+|hdn+",
    2.5: "hdn+",
    2.6: "hdn+",
  },
  sid: { 2.4: "official+", 2.6: "experimental+" },
  // Ubuntu
  trusty: { 1.8: "ppa+" },
  xenial: { 1.8: "ppa+", "2.0": "ppa+" },
  bionic: {
    1.8: "official-|ppa+",
    "2.0": "ppa+",
    2.2: "ppa+",
    2.3: "ppa+",
    2.4: "ppa+",
    2.5: "ppa+",
  },
  focal: {
    "2.0": "official-|ppa+",
    2.2: "ppa+",
    2.3: "ppa+",
    2.4: "ppa+",
    2.5: "ppa+",
    2.6: "ppa+",
  },
  impish: { 2.2: "official-" },
  jammy: {
    2.4: "official-|ppa+",
    2.5: "ppa+",
    2.6: "ppa+",
  },
  // END-MATRIX
};

createApp({
  // Supported distributions
  distributions: {
    Debian: {
      stretch: "Stretch (9)",
      buster: "Buster (10)",
      bullseye: "Bullseye (11)",
      sid: "Sid (unstable)",
    },
    Ubuntu: {
      trusty: "Trusty (14.04 LTS)",
      xenial: "Xenial (16.04 LTS)",
      bionic: "Bionic (18.04 LTS)",
      focal: "Focal (20.04 LTS)",
      jammy: "Jammy (22.04 LTS)",
    },
  },

  // HAProxy versions
  versions: {
    1.8: "1.8-stable (LTS)",
    "2.0": "2.0-stable (LTS)",
    2.2: "2.2-stable (LTS)",
    2.3: "2.3-stable",
    2.4: "2.4-stable (LTS)",
    2.5: "2.5-stable",
    2.6: "2.6-stable (LTS)",
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
      location.split("&").map((v) => v.split("="))
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
