
const shift = (arr, pos) => {
  
  let len = arr.length;

  if(pos > len){
    return 'limit exceeded'
  }
  


  for(let i=0; i<pos; i++){
      let j=0;

      const temp = arr[0];

      while(j<len-1){
          arr[j] = arr[j+1];
          j++
      }

      arr[len-1] = temp;
  }

  return arr;

}



const a = [1, 2, 3, 4, 5, 6, 7, 8];
const position = 9

const result = shift(a, position)


console.log(result);