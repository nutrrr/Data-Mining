import { 
    LoadItem, 
    geneticAlgorithm, 
    selectionState, 
    itemEnum 
} from './GeneticAlgorithm.js'; 

const selections = JSON.parse(localStorage.getItem('selections')) || [];

console.log("หมวดหมู่ที่เลือก:", selections); // ตรวจสอบค่าใน Console

// ตรวจสอบว่ามีหมวดหมู่หรือไม่
if (selections.length > 0) {
    document.getElementById('selectedCategories').innerText = selections.join(', ');
} else {
    document.getElementById('selectedCategories').innerText = "ไม่มีหมวดหมู่ที่เลือก";
}
function run(){
    var listItem = LoadItem() // data item in store
    const userItemTyep = [itemEnum.Drinks, itemEnum.Snacks, itemEnum.Food];
    const targetFitness = 65; // กำหนด fitness ที่จ้องการ
    
    const numPopulation = 4; // จำนวน Population ที่จะถูกสร้างขึ้นในแต่ละ Generation
    const selectedState = selectionState.Tournament; // set selectionState for algorithm
    const mutationRate = 0.5;  // กำหนด mutation rate เป็น 0.5 (หมายความว่ามีโอกาส 50% ที่จะมีการเปลี่ยนแปลง)

    const maxGeneration = 100;

    let output = geneticAlgorithm(userItemTyep, targetFitness, mutationRate, listItem, numPopulation, selectedState, maxGeneration);
    console.log(output)
}
run();