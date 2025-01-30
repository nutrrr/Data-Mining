//Use to find the key use values ​for listItem
export function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value.includes(searchValue)){
            return key;
        }
    }
}


export function removeArrayByValue(array, value){
    var index = array.indexOf(value);
    if (index !== -1) {
    array.splice(index, 1);
    }

}

export function getMinFiteness(population){
    let minFiteness = fitnessFunction(population[0]);
    for (let i = 1; i < population.length; i++){
        fit = fitnessFunction(population[i]);
        if(minFiteness > fit){
            minFiteness = fit;
        }
    }

    return minFiteness;
}

// Calculate fitness
export function fitnessFunction(gene) {
    let fit = 0;
    for (let i = 0; i < gene.length; i++) {
        fit += gene[i].price;
    }
    return fit;
}

export function rouletteWheelSelection(population, numSelected) {
    // Calculate total fitness
    let chromosomes = population;
    let fitnessScores = [];
    for (let i = 0; i < chromosomes.length; i++){
        let fitness = fitnessFunction(chromosomes[i]);
        fitnessScores.push(fitness);
    }
    
    const selectedChromosomes = [];
    for (let i = 0; i < numSelected; i++) {
        let totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);
        // สุ่มเลือกโครโมโซมตามจำนวน tournamentSize
        let indexToRemove = 0;
        let randomNum = Math.random() * totalFitness;
        // วนลูปเพื่อหาตัวแปรที่ถูกเลือก
        let weightSum = 0;
        for (let i = 0; i < fitnessScores.length; i++) {
          weightSum += fitnessScores[i];
          if (randomNum < fitnessScores) {
            indexToRemove = i; // return index ของตัวแปรที่ถูกเลือก
            }
        }
        selectedChromosomes.push(chromosomes[indexToRemove]);
        chromosomes.splice(indexToRemove, 1);
        fitnessScores.splice(indexToRemove, 1);

    }

    return selectedChromosomes;

}

export function linearRankingSelection(population, numSelected){
    const selectedChromosomes = [];

    for (let i = 0; i < numSelected; i++) {
        const rankedPopulation = chromosomeFitnessRanking(population); // จัดอันดับโครโมโซมจากค่าฟิตเนส
        const n = rankedPopulation.length;
        let selectionProbabilities = [];
        // คำนวณค่า probability ตาม linear ranking
        for (let i = 0; i < n; i++) {
            let rank = rankedPopulation[i].rank;
            let probability = (2 * (n - rank + 1)) / (n * (n + 1)); 
            selectionProbabilities.push(probability);
        }

        let randomNum = Math.random();
        let cumulativeProbability = 0;

        for (let j = 0; j < n; j++) {
            cumulativeProbability += selectionProbabilities[j];
            if (randomNum < cumulativeProbability) {
                selectedChromosomes.push(rankedPopulation[j].chromosome);
                removeArrayByValue(population, rankedPopulation[j].chromosome);
                break;
            }
        }
    }
    return selectedChromosomes;
}


// ฟังก์ชันจัดอันดับโครโมโซมตามค่าความเหมาะสม
export function chromosomeFitnessRanking(population) {
    const fitnessScores = population.map((chromosome) => ({
        chromosome,
        fitness: fitnessFunction(chromosome),
    }));

    const rankedPopulation = fitnessScores
        .sort((a, b) => a.fitness - b.fitness)
        .map((item, index) => ({
            rank: index + 1, 
            ...item,
        }));

    return rankedPopulation;
}

// ฟังก์ชัน Tournament Selection
export function tournamentSelection(population, tournamentSize, numSelected) {
    const selectedChromosomes = [];
    for (let i = 0; i < numSelected; i++) {
        // สุ่มเลือกโครโมโซมตามจำนวน tournamentSize
        const tournamentParticipants = [];
        for (let j = 0; j < tournamentSize; j++) {
            const randomIndex = Math.floor(Math.random() * population.length);
            tournamentParticipants.push(population[randomIndex]);
        }

        // คำนวณ fitness และเลือกโครโมโซมที่มี fitness สูงสุด
        const bestChromosome = tournamentParticipants.reduce((best, current) => {
            const bestFitness = fitnessFunction(best);
            const currentFitness = fitnessFunction(current);
            return currentFitness > bestFitness ? current : best;
        });

        selectedChromosomes.push(bestChromosome);
        removeArrayByValue(population, bestChromosome);
    }
    return selectedChromosomes;
}

// ฟังก์ชัน Crossover ที่สร้าง offspring จากพ่อแม่ 2 ตัว
export function crossover(parent1, parent2) {
    const crossoverPoint = Math.floor(parent1.length / 2);  // จุดที่ทำการ crossover (ครึ่งหนึ่งของโครโมโซม)
    const offspring1 = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
    const offspring2 = [...parent2.slice(0, crossoverPoint), ...parent1.slice(crossoverPoint)];
    return [offspring1, offspring2];
}

// ฟังก์ชัน Mutation ที่สุ่มเปลี่ยนค่าเป็นตัวเลขที่ไม่ใช่ 0 หรือ 1
export function mutateChromosome(chromosome, mutationRate, listItem) {
    return chromosome.map((gene) => {
        if (Math.random() < mutationRate) {
            let newGene;
            do {
                let newListItem = listItem.get(getByValue(listItem, gene));
                newGene = newListItem[Math.floor(Math.random() * newListItem.length)]; // สุ่มเลขจาก 2 ถึง 10
            } while (newGene === gene); // ถ้าค่าที่สุ่มออกมาเหมือนเดิม ให้สุ่มใหม่
            return newGene;
        }
        return gene;
    });
}


// Generate initial population
export function initialPopulation(gene, pop, listItem) {
    var chromosomes = [];
    for (var i = 0; i < pop; i++) {
        var chromosome = [];
        for (var j = 0; j < gene.length; j++) {
            var items = listItem.get(gene[j]);
            chromosome.push(items[Math.floor(Math.random()*items.length)]);
        }
        chromosomes.push(chromosome); 
    }
    return chromosomes;
}

export function LoadItem(){
    var json = itemData;
    var listItem = new Map()
    for(var i=0; i < json.length; i++){
        var itemType = json[i].type;
        var itemVar = {name: json[i].name, price: json[i].price};
        if(listItem.has(itemType)){
            listItem.get(itemType).push(itemVar)
        }
        else{
            listItem.set(itemType, [itemVar]);
        }
    }
    return listItem;
}

export const selectionState = Object.freeze({
    RouletteWheel: 0,
    Tournament: 1,
    LinearRanking: 2
});

export const itemEnum = Object.freeze({
    Drinks: "เครื่องดื่ม",
    Snacks: "ขนมขบเคี้ยว",
    Vegetables: "ผัก-ผลไม้",
    Food: "อาหาร",
    Supplies: "ของใช้"
})

export function geneticAlgorithm(userItemTyep, targetFitness, mutationRate, listItem, numPopulation, selectedState, maxGeneration){
    // ---------------------------------------Initial Population--------------------------------------------
    const startTime = performance.now() // ใช้จับเวลาเริ่มทำงาน
    let log = [];
    let init = {
        phase: 'initialization',
        parameters: {
            targetFitness,
            mutationRate,
            numPopulation,
            selectedState,
            maxGeneration,
            userItemTypes: userItemTyep
        }
    };

    let generation = 0;

    let Population = initialPopulation(userItemTyep, numPopulation, listItem);
    let rankedPopulation;

    let firstGeneration = {
        population: Population.map(chromosome => ({
            chromosome,
            fitness: fitnessFunction(chromosome)
        }))
    };


    do{
        generation += 1;
        var tmpPopulation = [];
        let generationLog = {
            generation,
            selections: [],
            crossovers: [],
            mutations: [],
            finalPopulation: null
        };

        
        do{
            // ---------------------------------------Selection scheme--------------------------------------
            var selectedChromosomes;
            switch (selectedState){
                case  selectionState.RouletteWheel:
                    selectedChromosomes = rouletteWheelSelection(Population, 2); // เลือก 2 โครโมโซม จากการสุ่ม
                    break;
                case  selectionState.Tournament:
                    const tournamentSize = 3;  // ขนาดของ Tournament
                    selectedChromosomes = tournamentSelection(Population, tournamentSize, 2);  // เลือก 2 โครโมโซม จากการสุ่ม
                    break;
                case  selectionState.LinearRanking:
                    selectedChromosomes = linearRankingSelection(Population, 2)
                    break;
                
            }

            generationLog.selections.push({
                
                selectedChromosomes: selectedChromosomes.map(chromosome => ({
                    chromosome,
                    fitness: fitnessFunction(chromosome)
                })),
            });
            
            
            // ------------------------------------Crossover operator---------------------------------------
            const selectedParents = selectedChromosomes.slice(0, 2); // เลือก 2 โครโมโซมเป็นพ่อแม่
            const [offspring1, offspring2] = crossover(selectedParents[0], selectedParents[1]);
            
            generationLog.crossovers.push({
                parents: selectedParents.map(chromosome => ({
                    chromosome,
                    fitness: fitnessFunction(chromosome)
                })),
                offspring: [
                    { chromosome: offspring1, fitness: fitnessFunction(offspring1) },
                    { chromosome: offspring2, fitness: fitnessFunction(offspring2) }
                ]
            });


            // -------------------------------------Mtation operator----------------------------------------
            const mutatedOffspring1 = mutateChromosome(offspring1, mutationRate, listItem);
            const mutatedOffspring2 = mutateChromosome(offspring2, mutationRate, listItem);

            tmpPopulation.push(mutatedOffspring1);
            tmpPopulation.push(mutatedOffspring2);

            generationLog.mutations.push({
                beforeMutation: [
                    { chromosome: offspring1, fitness: fitnessFunction(offspring1) },
                    { chromosome: offspring2, fitness: fitnessFunction(offspring2) }
                ],
                afterMutation: [
                    { chromosome: mutatedOffspring1, fitness: fitnessFunction(mutatedOffspring1) },
                    { chromosome: mutatedOffspring2, fitness: fitnessFunction(mutatedOffspring2) }
                ],
                mutationRate
            });
        }while(Population.length > 0)


        rankedPopulation = chromosomeFitnessRanking(tmpPopulation);
        let numChrKeep = 2; // จำนวนที่เก็บ chromosome ไว้ในรอบถัดไป
        let newPopulation = [];
        for(let i = 0; i < numChrKeep; i++){
            newPopulation.push(rankedPopulation[i].chromosome)
        }
        
        Population = newPopulation.concat(initialPopulation(userItemTyep, numPopulation - numChrKeep, listItem))

        
        generationLog.finalPopulation = {
            rankedPopulation: rankedPopulation.map(item => ({
                chromosome: item.chromosome,
                fitness: item.fitness,
                rank: item.rank
            })),
            newPopulation: Population.map(chromosome => ({
                chromosome,
                fitness: fitnessFunction(chromosome)
            }))
        };
        log.push(generationLog);
    } while (rankedPopulation[0].fitness > targetFitness && generation <= maxGeneration)

        
    const endTime = performance.now(); // ใช้จับเวลาจบทำงาน
    const executionTime = endTime - startTime; // เวลาในการทำงานทั้งหมด
    const result = {chromosome: rankedPopulation[0].chromosome, fitness: rankedPopulation[0].fitness, time: executionTime, initialInfo: init, firstGeneration: firstGeneration, log: log}
    return result;

}



const itemData = [
    {
      "type": "เครื่องดื่ม",
      "name": "โค้ก",
      "price": 15
    },
    {
      "type": "เครื่องดื่ม",
      "name": "น้ำส้ม",
      "price": 20
    },
    {
      "type": "เครื่องดื่ม",
      "name": "ชาเขียว",
      "price": 18
    },
    {
      "type": "ขนมขบเคี้ยว",
      "name": "มันฝรั่งทอด",
      "price": 20
    },
    {
      "type": "ขนมขบเคี้ยว",
      "name": "บิสกิต",
      "price": 30
    },
    {
      "type": "ขนมขบเคี้ยว",
      "name": "ถั่วลิสง",
      "price": 25
    },
    {
      "type": "ผัก-ผลไม้",
      "name": "แอปเปิล",
      "price": 12
    },
    {
      "type": "ผัก-ผลไม้",
      "name": "กล้วย",
      "price": 10
    },
    {
      "type": "ผัก-ผลไม้",
      "name": "มะเขือเทศ",
      "price": 25
    },
    {
      "type": "อาหาร",
      "name": "ข้าวสวย",
      "price": 30
    },
    {
      "type": "อาหาร",
      "name": "ไข่ไก่",
      "price": 35
    },
    {
      "type": "อาหาร",
      "name": "ไก่ทอด",
      "price": 50
    },
    {
      "type": "ของใช้",
      "name": "ผงซักฟอก",
      "price": 50
    },
    {
      "type": "ของใช้",
      "name": "สบู่",
      "price": 20
    },
    {
      "type": "ของใช้",
      "name": "น้ำยาล้างจาน",
      "price": 35
    }
  ]