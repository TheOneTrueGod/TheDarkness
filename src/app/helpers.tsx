function makeAPICall(url: string, body: object = {}) {
    return new Promise ((resolve, reject) => {
        fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body)
            }
        )
        .then(res => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            } else if (res.status === 504) {
                window.location.replace("/login");
                return;
            }
            reject(res);
        }).then(resJSON => {
            resolve(resJSON);
        });
    });
}

function rotateMatrix<T>(grid: Array<T>, numRotations: number, rowLength?: number): Array<T> {
    rowLength = rowLength || Math.sqrt(grid.length);
    let newGrid = grid.map(i => i);
    for (var j = 0; j < numRotations; j++) {
        let oldGrid = newGrid.map((i) => i);   
        for (var i = 0; i < grid.length; i++)
        {
            var x = i % rowLength;
            var y = Math.floor(i / rowLength);
            var newX = rowLength - y - 1;
            var newY = x;    
            var newPosition = newY * rowLength + newX;
            newGrid[newPosition] = oldGrid[i];
        }
    }
    
    return newGrid;
}

export {
    makeAPICall,
    rotateMatrix,
};
