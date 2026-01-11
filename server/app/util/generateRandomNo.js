exports.generateRandomNo = () => {
  const minCeiled = Math.ceil(9999);
  const maxFloored = Math.floor(1000);
  const random1 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const random2 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const random3 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const notice_no = random1 + '-' + random2 + '-' + random3;

  console.log('notice_no', notice_no)
  return notice_no;
}