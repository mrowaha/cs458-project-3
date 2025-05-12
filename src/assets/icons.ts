import ReactComponent from "*.svg?react";

const loadIcons = () => {
  const icons: Record<string, typeof ReactComponent> = {};

  const modules = import.meta.glob("./icons/**/*.svg", {
    eager: true,
    import: "default",
  });

  for (const path in modules) {
    const pathArr = path.split("/");
    // currently only namespace based icons is supported not on a more nested level
    let fileName;
    if (pathArr.length === 4) {
      // is in a namespace
      fileName = `${pathArr[2]}:${pathArr[3]}`;
    } else if (pathArr.length === 3) {
      fileName = pathArr[2];
    }
    if (fileName) {
      const name: string = fileName.replace(".svg", "");
      icons[name] = modules[path] as typeof ReactComponent;
    }
  }
  return icons;
};

let icons = loadIcons();

// Hot Module Replacement (HMR) desteği
if (import.meta.hot) {
  import.meta.hot.accept(Object.keys(import.meta.glob("./icons/*.svg")), () => {
    icons = loadIcons();
  });
}

export { icons };
