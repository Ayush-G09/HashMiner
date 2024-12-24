export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CodeType = "#01" | "#02" | "#03" | "#04" | "#05" | "#06" | "#07";

export function getNameByCode(code: CodeType): string {
  const codeToNameMap: Record<CodeType, string> = {
    "#01": "Basic Miner",
    "#02": "Advanced Miner",
    "#03": "Pro Miner",
    "#04": "Galaxy Miner",
    "#05": "Quantum Extractor",
    "#06": "Cosmic Harvester",
    "#07": "Nebula Reactor",
  };

  return codeToNameMap[code];
}

  export function getImageByCode(code: CodeType) {
    const codeToImageMap = {
      "#01": require('../assets/m1.png'),
      "#02": require('../assets/m2.png'),
      "#03": require('../assets/m3.png'),
      "#04": require('../assets/m4.png'),
      "#05": require('../assets/m5.png'),
      "#06": require('../assets/m6.png'),
      "#07": require('../assets/m7.png'),
    };
  
    return codeToImageMap[code];
  }