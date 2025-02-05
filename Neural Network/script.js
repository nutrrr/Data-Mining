class Node {
    constructor(id, type, value = 0) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.fun = ''
        this.element = this.createNodeElement();
        this.connections = [];
        this.weights = [];
        this.miniWindow = this.createMiniWindow();
    }

    createNodeElement() {
        const circle = document.createElement('div');
        circle.className = 'circle';
        if (this.type === 'output') {
            circle.className += ' output';
        }
        circle.textContent = this.id;
        circle.addEventListener('click', (e) => this.showMiniWindow(e));
        return circle;
    }

    createMiniWindow() {
        const miniWindow = document.createElement('div');
        miniWindow.className = 'mini-window';
        miniWindow.style.display = 'none';

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'mini-window-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            this.miniWindow.style.display = 'none';
        });
        miniWindow.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} Node ${this.id}`;
        miniWindow.appendChild(title);

        if (this.type === 'input') {
            const valueGroup = document.createElement('div');
            valueGroup.className = 'input-group';

            const valueLabel = document.createElement('label');
            valueLabel.textContent = `Value:`;
            valueGroup.appendChild(valueLabel);

            const valueInput = document.createElement('input');
            valueInput.type = 'number';
            valueInput.id = `circle${this.id}-value`;
            valueInput.value = this.value;
            valueInput.addEventListener('input', (e) => {
                this.value = parseFloat(e.target.value) || 0; // Store value in the node
            });

            valueGroup.appendChild(valueInput);
            miniWindow.appendChild(valueGroup);

            // Weight input rows (one for each connection)
            this.connections.forEach((conn, index) => {
            const weightGroup = document.createElement('div');
            weightGroup.className = 'input-group';

            const weightLabel = document.createElement('label');
            weightLabel.textContent = `Weight to ${conn.id}:`;
            weightGroup.appendChild(weightLabel);

            const weightInput = document.createElement('input');
            weightInput.type = 'number';
            weightInput.id = `circle${this.id}-weight${conn.id}`;
            weightInput.value = this.weights[index] || 0;
            weightInput.addEventListener('input', (e) => {
                this.weights[index] = parseFloat(e.target.value) || 0; // Store weight in array
            });

            weightGroup.appendChild(weightInput);
            miniWindow.appendChild(weightGroup);
        });
        } else if (this.type === 'hidden') {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';

            const label = document.createElement('label');
            label.textContent = 'Activation Function:';
            inputGroup.appendChild(label);

            const select = document.createElement('select');
            select.id = `circle${this.id}-activation`;
            
            const options = ['Sigmoid', 'Threshold'];
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.toLowerCase();
                option.textContent = opt;
                select.appendChild(option);
            });
            select.addEventListener('change', (e) => {
                this.fun = select.value;
            });

            if(this.fun === ''){
                this.fun = select.value;
            }
            select.value = this.fun ;
            inputGroup.appendChild(select);
            miniWindow.appendChild(inputGroup);

            // Weight input rows (one for each connection)
            this.connections.forEach((conn, index) => {
                const weightGroup = document.createElement('div');
                weightGroup.className = 'input-group';
    
                const weightLabel = document.createElement('label');
                weightLabel.textContent = `Weight to ${conn.id}:`;
                weightGroup.appendChild(weightLabel);
    
                const weightInput = document.createElement('input');
                weightInput.type = 'number';
                weightInput.id = `circle${this.id}-weight${conn.id}`;
                weightInput.value = this.weights[index] || 0;
                weightInput.addEventListener('input', (e) => {
                    this.weights[index] = parseFloat(e.target.value) || 0; // Store weight in array
                });
    
                weightGroup.appendChild(weightInput);
                miniWindow.appendChild(weightGroup);
            });
        } else if (this.type === 'output') {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            const label = document.createElement('label');
            label.textContent = `output : ${this.value}`;
            inputGroup.appendChild(label);
            miniWindow.appendChild(inputGroup);
        }

        document.body.appendChild(miniWindow);
        return miniWindow;
    }

    showMiniWindow(event) {
        // Recreate mini window to update input slots
        this.miniWindow.remove();
        this.miniWindow = this.createMiniWindow();
        const rect = this.element.getBoundingClientRect();
        this.miniWindow.style.display = 'block';
        this.miniWindow.style.left = `${rect.right + 10}px`;
        this.miniWindow.style.top = `${rect.top}px`;
        event.stopPropagation();
    }

    // เพิ่มการเชื่อมต่อ
    addConnection(node) {
        if (!this.connections.includes(node)) {
            this.connections.push(node);
            this.weights.push(0)
        }
    }

    // ลบการเชื่อมต่อ
    removeConnection(node) {
        this.connections = this.connections.filter(conn => conn !== node);
        this.weights.pop()
    }

    // ดึงรายการการเชื่อมต่อ
    getConnections() {
        return this.connections;
    }

    addValue(){
        this.connections.forEach((node, index) =>{
            if (this.type === 'input') {
                node.value = node.value ? node.value : 0;
                node.value += this.value + this.weights[index];
            }else if (this.type === 'hidden') {
                if(this.fun === 'sigmoid'){
                    node.value += this.sigmoid(this.value);
                    node.value += this.weights[index];
                }
                else if(this.fun === 'threshold'){
                    node.value += this.threshold(this.value);
                }        
            }
        })
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    threshold (x){ 
        if (x < 0){return 0;}
        return x;
    }

}

let circleCounter = 1;
const miniWindows = new Map();
const nodes = new Map(); // เก็บโหนดทั้งหมด
const nodes_1 = new Map();
const nodes_2 = new Map();
const nodes_3 = new Map();

function addCircle(columnNum) {
    const column = document.getElementById(`column${columnNum}`);
    const type = columnNum === 1 ? 'input' : columnNum === 2 ? 'hidden' : 'output';
    const node = new Node(circleCounter, type);
    miniWindows.set(node.element, node.miniWindow);
    
    nodes.set(node.id, node); // เพิ่มโหนดลงใน Map
    if(columnNum == 1){
        nodes_1.set(node.id, node);
    }
    else if(columnNum == 2){
        nodes_2.set(node.id, node)
    }
    else if(columnNum == 3){
        nodes_3.set(node.id, node);
    }


    column.appendChild(node.element);
    circleCounter++;
    drawLines();
    console.log(nodes);
}

function removeCircle(columnNum) {
    const column = document.getElementById(`column${columnNum}`);
    if (column.lastChild && column.lastChild.className !== 'layer-label') {
        const nodeId = parseInt(column.lastChild.textContent);
        const node = nodes.get(nodeId);

        // ลบการเชื่อมต่อทั้งหมดที่เกี่ยวข้องกับโหนดนี้
        nodes.forEach(otherNode => {
            otherNode.removeConnection(node);
        });

        // ลบโหนดออกจาก Map
        nodes.delete(nodeId);

        const miniWindow = miniWindows.get(column.lastChild);
        if (miniWindow) {
            miniWindow.remove();
            miniWindows.delete(column.lastChild);
        }
        column.removeChild(column.lastChild);
        drawLines();
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.mini-window') && !e.target.closest('.circle')) {
        miniWindows.forEach(window => {
            window.style.display = 'none';
        });
    }
});

function drawLines() {
    const svg = document.getElementById('lines');
    svg.innerHTML = '';

    const col1 = Array.from(document.getElementById('column1').children)
        .filter(child => child.className.includes('circle'));
    const col2 = Array.from(document.getElementById('column2').children)
        .filter(child => child.className.includes('circle'));
    const col3 = Array.from(document.getElementById('column3').children)
        .filter(child => child.className.includes('circle'));

    // เชื่อมต่อโหนดในคอลัมน์ 1 กับคอลัมน์ 2
    for (let i = 0; i < col1.length; i++) {
        const fromNode = nodes.get(parseInt(col1[i].textContent));
        for (let j = 0; j < col2.length; j++) {
            const toNode = nodes.get(parseInt(col2[j].textContent));
            fromNode.addConnection(toNode); // เพิ่มการเชื่อมต่อ
            drawLine(col1[i], col2[j]);
        }
    }

    // เชื่อมต่อโหนดในคอลัมน์ 2 กับคอลัมน์ 3
    for (let i = 0; i < col2.length; i++) {
        const fromNode = nodes.get(parseInt(col2[i].textContent));
        for (let j = 0; j < col3.length; j++) {
            const toNode = nodes.get(parseInt(col3[j].textContent));
            fromNode.addConnection(toNode); // เพิ่มการเชื่อมต่อ
            drawLine(col2[i], col3[j]);
        }
    }
}

function drawLine(from, to) {
    const svg = document.getElementById('lines');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const containerRect = svg.getBoundingClientRect();

    const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
    const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
    const x2 = toRect.left - containerRect.left + toRect.width / 2;
    const y2 = toRect.top - containerRect.top + toRect.height / 2;

    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#bdc3c7');
    line.setAttribute('stroke-width', '2');

    svg.appendChild(line);
}


function resetNN(){
    nodes_2.forEach((node) => {
        node.value = 0

    })
    nodes_3.forEach((node) => {
        node.value = 0

    })
}

function runNN(){
    resetNN()
    nodes_1.forEach((node) =>{
        node.addValue()
    })
    nodes_2.forEach((node) =>{
        node.addValue()
    })
    console.log(nodes);

}


