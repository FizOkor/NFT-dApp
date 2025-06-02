export async function uploadToNFTStorage(name, description, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('name', name);
  formData.append('description', description);
  
  try {
    const response = await fetch(`${window.location.origin}/api/upload-nft`, {
      method: 'POST',
      body: formData
    });
  } catch (err){
    console.log(err);
  }

  const { metadataUrl } = await response.json();
  
  return metadataUrl;
}