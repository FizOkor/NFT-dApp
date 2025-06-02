export async function uploadToNFTStorage(name, description, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('name', name);
  formData.append('description', description);
  
  
  const response = await fetch(`/api/upload-nft`, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  });
  console.log(response)

  const { metadataUrl } = await response;
  
  return metadataUrl;
}