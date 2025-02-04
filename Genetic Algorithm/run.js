import { 
    LoadItem, 
    geneticAlgorithm, 
    selectionState, 
    itemEnum 
} from './GeneticAlgorithm.js'; 

// กำหนดค่าพารามิเตอร์ทั้งหมด
var listItem = LoadItem(); // โหลดข้อมูลจากฟังก์ชัน LoadItem
const userItemTyep = [itemEnum.Drinks, itemEnum.Snacks, itemEnum.Food]; // ประเภทของรายการที่ต้องการ
const targetFitness = 65;  // ค่า fitness ที่ต้องการ
const numPopulation = 4;   // จำนวน Population ในแต่ละ Generation
const selectedState = selectionState.Tournament; // การเลือกแบบ Tournament
const mutationRate = 0.5;  // ค่า Mutation Rate
const maxGeneration = 100; // จำนวน Generation ที่จะรัน

// เรียกใช้ geneticAlgorithm พร้อมพารามิเตอร์ที่กำหนดไว้
let output = geneticAlgorithm(userItemTyep, targetFitness, mutationRate, listItem, numPopulation, selectedState, maxGeneration);

// แสดงผลลัพธ์ใน Console
console.log("ผลลัพธ์จาก Genetic Algorithm:");
console.log("Time Taken:", output.time); // เวลาที่ใช้ในการทำงาน
console.log("Initial Info:", output.initialInfo); // ข้อมูลเริ่มต้น
console.log("First Generation:", output.firstGeneration); // กลุ่มข้อมูลแรก
console.log("Log of each Generation:", output.log); // การทำงานในแต่ละ generation

// แสดงผลลัพธ์บนหน้าเว็บ
document.body.innerHTML += `<h2>ผลลัพธ์จาก Genetic Algorithm:</h2>`;
document.body.innerHTML += `<p><strong>Time Taken:</strong> ${output.time} ms</p>`;
document.body.innerHTML += `<p><strong>Initial Info:</strong> <pre>${JSON.stringify(output.initialInfo, null, 2)}</pre></p>`;
document.body.innerHTML += `<p><strong>First Generation:</strong> <pre>${JSON.stringify(output.firstGeneration, null, 2)}</pre></p>`;
document.body.innerHTML += `<p><strong>Log of each Generation:</strong> <pre>${JSON.stringify(output.log, null, 2)}</pre></p>`;