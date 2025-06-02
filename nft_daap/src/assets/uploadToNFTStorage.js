export async function uploadToNFTStorage(name, description, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('name', name);
  formData.append('description', description);
  
  console.log(window.location.origin)
  const response = await fetch(`${window.location.origin}/api/upload-nft`, {
    method: 'POST',
    body: formData
  });

  const { metadataUrl } = await response.json();
  
  return metadataUrl;
}