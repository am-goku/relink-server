const binary = (a, low,  high, item) => {
    const mid = Math.floor((low+high) / 2);
        if(low <= mid && high >= mid){
            if (a[mid] === item) {
              return mid;
            } else if (a[mid] > item) {
              return binary(a, low, mid-1, item);
            } else if (a[mid] < item) {
              return binary(a, mid+1, high, item);
            }
        } else {
            return -1
        }
};


const a = [1, 2, 3, 4, 5, 6, 7, 8];

const p = binary(a, 0, 7, 4);

console.log(p);