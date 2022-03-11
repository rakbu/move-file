// Please update this type as same as with the data shape.
type DosyaTipleri = { 
  id:string, 
  name:string 
};

type Dosya = {
  id:string,
  name:string,
  files:DosyaTipleri[]
}

const list : Dosya[] = [
  {
    id: '1',
    name: 'Folder 1',
    files: [
      { id: '2', name: 'File 1' },
      { id: '3', name: 'File 2' },
      { id: '4', name: 'File 3' },
      { id: '5', name: 'File 4' },
    ],
  },
  {
    id: '6',
    name: 'Folder 2',
    files: [{ id: '7', name: 'File 5' }],
  },
];

function dosyaTasinirkenValidasyon(
  list: Dosya[],
  fileId: string,
  locationId: string
): never {

  // Eğer gönderilecek klasörün içerisinde aynı id'de nesne varsa işlemi durdur;
  const dosyaIndex = list.findIndex((param) => param.id === fileId);
  if (dosyaIndex !== -1){
    throw new Error("Aynı ID'de dosya bulunuyor. Bu dosyayı taşıyamayız.");
  } 

  // Eğer lokasyonda aynı ID'ye sahip dosya varsa işlemi durdur;
  const locationIndex = list.findIndex((param) =>
    param.files.some((dosya) => dosya.id === locationId)
  );
  if (locationIndex !== -1){
    throw new Error("Lokasyonda birden fazla aynı id'ye sahip içerik var. bu işlem yapılamaz.");
  }

  // diğer durumlarda
  throw new Error("Dosya bulunamadı");
}

function dosyaIdleriniBul(
  list: Dosya[],
  kaynakId: string,
  locationId: string
): [{
  kaynakDosyaIndex: number,
  lokasyonKlasoruIndex: number,
  dosyaIndex: number}] {

  // Aranılan ID'nin folder lokasyonunu index değeriyle yakala
  const kaynakDosyaIndex = list.findIndex((param) =>
    param.files.some((dosya) => dosya.id === kaynakId)
  );
  
  //Klasörün lokasyonu index değeriyle bulunur;
  const lokasyonKlasoruIndex = list.findIndex(
    (param) => param.id === locationId
  );

  //İşlem başladığında validasyon kontrolü yapılacak, hata varsa throw error;
  if (kaynakDosyaIndex === -1 || lokasyonKlasoruIndex === -1)
  dosyaTasinirkenValidasyon(list, kaynakId, locationId);

  // İşlem yapıldıktan sonra, taşınan dosyaların ID'sini güncelle
  const dosyaIndex = list[kaynakDosyaIndex].files.findIndex(
    (dosya) => dosya.id === kaynakId
  );

  // returning all the indices
  return [{kaynakDosyaIndex, lokasyonKlasoruIndex, dosyaIndex}];
}


export default function move(list: Dosya[], source: string, destination: string): Dosya[] {
  // Taşıma işleminden önce Listeyi dublicate et
  const ListKopya = [...list];

  // Event içerisinde aksiyon alan ID'yi işlemden geçir;
  const [{kaynakDosyaIndex, lokasyonKlasoruIndex, dosyaIndex }] = dosyaIdleriniBul(list, source, destination);

  // Taşınması gereken dosyayı splice ile var olduğu id'den kesiyorum, aslında silinmişler dönüyor;
  // her eventta silinme işlemi olacağı için bu array sürekli 1 dönecektir.
  const gonderilenDosya = ListKopya[kaynakDosyaIndex].files.splice(
    dosyaIndex,
    1
  )[0];

  // Taşınması gereken dosya burada push ile lokasyonuna Array'ine teslim edilir.
  ListKopya[lokasyonKlasoruIndex].files.push(gonderilenDosya);

  // Kopyalanmış liste return edilir data güncellenir.
  return ListKopya;
}