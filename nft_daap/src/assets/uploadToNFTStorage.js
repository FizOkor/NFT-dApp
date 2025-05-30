import lighthouse from '@lighthouse-web3/sdk';

// async function getLighthouseKey() {  
//   const response = await fetch('http://localhost:3001/api/lighthouse/key');
//   const { apiKey } = await response.json();

//   return apiKey;
// }

// const apiKey = 'c56851ae.c2e7ba21420b4e6aa62cc3d1f8d4ccf4' //from backend

// export async function uploadToNFTStorage(name, description, imageFile) {
//     try {
//       const apiKey = await getLighthouseKey();
//       // image
//       const imageResponse = await lighthouse.upload([imageFile], apiKey);
//       const imageCid = imageResponse.data.Hash;
//       const imageUrl = `https://gateway.lighthouse.storage/ipfs/${imageCid}`;
  
//       // Metadata
//       const metadata = {
//         name,
//         description,
//         image: imageUrl,
//       };
  
//       const metadataBlob = new Blob([JSON.stringify(metadata)], {
//         type: 'application/json',
//       });
  
//       const metadataFile = new File([metadataBlob], 'metadata.json', {
//         type: 'application/json',
//       });
  
//       // Upload metadata
//       const metadataResponse = await lighthouse.upload([metadataFile], apiKey);
//       const metadataCid = metadataResponse.data.Hash;
//       const metadataUrl = `https://gateway.lighthouse.storage/ipfs/${metadataCid}`;
      
//       return metadataUrl;
//     } catch (err) {
//       console.error('Upload failed:', err);
//       throw err;
//     }
//   }

export async function uploadToNFTStorage(name, description, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('name', name);
  formData.append('description', description);

  const response = await fetch('http://localhost:3001/api/upload-nft', {
    method: 'POST',
    body: formData
  });

  const { metadataUrl } = await response.json();
  
  return metadataUrl; // Same format as your original
}