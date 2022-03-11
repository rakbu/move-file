"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var list = [
    {
        id: '1',
        name: 'Folder 1',
        files: [
            { id: '2', name: 'File 1' },
            { id: '3', name: 'File 2' },
            { id: '4', name: 'File 3' },
            { id: '5', name: 'File 4' },
        ]
    },
    {
        id: '6',
        name: 'Folder 2',
        files: [{ id: '7', name: 'File 5' }]
    },
];
function dosyaTasinirkenValidasyon(list, fileId, locationId) {
    // Eğer gönderilecek klasörün içerisinde aynı id'de nesne varsa işlemi durdur;
    var dosyaIndex = list.findIndex(function (param) { return param.id === fileId; });
    if (dosyaIndex !== -1) {
        throw new Error("Aynı ID'de dosya bulunuyor. Bu dosyayı taşıyamayız.");
    }
    // Eğer lokasyonda aynı ID'ye sahip dosya varsa işlemi durdur;
    var locationIndex = list.findIndex(function (param) {
        return param.files.some(function (dosya) { return dosya.id === locationId; });
    });
    if (locationIndex !== -1) {
        throw new Error("Lokasyonda birden fazla aynı id'ye sahip içerik var. bu işlem yapılamaz.");
    }
    // diğer durumlarda
    throw new Error("Dosya bulunamadı");
}
function dosyaIdleriniBul(list, kaynakId, locationId) {
    // Aranılan ID'nin folder lokasyonunu index değeriyle yakala
    var kaynakDosyaIndex = list.findIndex(function (param) {
        return param.files.some(function (dosya) { return dosya.id === kaynakId; });
    });
    //Klasörün lokasyonu index değeriyle bulunur;
    var lokasyonKlasoruIndex = list.findIndex(function (param) { return param.id === locationId; });
    //İşlem başladığında validasyon kontrolü yapılacak, hata varsa throw error;
    if (kaynakDosyaIndex === -1 || lokasyonKlasoruIndex === -1)
        dosyaTasinirkenValidasyon(list, kaynakId, locationId);
    // İşlem yapıldıktan sonra, taşınan dosyaların ID'sini güncelle
    var dosyaIndex = list[kaynakDosyaIndex].files.findIndex(function (dosya) { return dosya.id === kaynakId; });
    // returning all the indices
    return [{ kaynakDosyaIndex: kaynakDosyaIndex, lokasyonKlasoruIndex: lokasyonKlasoruIndex, dosyaIndex: dosyaIndex }];
}
function move(list, source, destination) {
    // Taşıma işleminden önce Listeyi dublicate et
    console.log(list);
    var ListKopya = __spreadArray([], list);
    // Event içerisinde aksiyon alan ID'yi işlemden geçir;
    var _a = dosyaIdleriniBul(list, source, destination)[0], kaynakDosyaIndex = _a.kaynakDosyaIndex, lokasyonKlasoruIndex = _a.lokasyonKlasoruIndex, dosyaIndex = _a.dosyaIndex;
    // Taşınması gereken dosyayı splice ile var olduğu id'den kesiyorum, aslında silinmişler dönüyor;
    // her eventta silinme işlemi olacağı için bu array sürekli 1 dönecektir.
    var gonderilenDosya = ListKopya[kaynakDosyaIndex].files.splice(dosyaIndex, 1)[0];
    // Taşınması gereken dosya burada push ile lokasyonuna Array'ine teslim edilir.
    ListKopya[lokasyonKlasoruIndex].files.push(gonderilenDosya);
    console.log(ListKopya);
    // Kopyalanmış liste return edilir data güncellenir.
    return ListKopya;
}
exports["default"] = move(list, "4", "6");
