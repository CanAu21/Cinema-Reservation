//! HTML'den gelenler
const container = document.querySelector(".container");
const infoText = document.querySelector(".infoText");
const totalSeatCount = document.getElementById("count");
const totalPrice = document.getElementById("amount");
const movieSelect = document.getElementById("movie");
const allSeats = document.querySelectorAll(".seat:not(.reserve)");


// seçilen koltukları veri tabanına gönderme
const saveToDatabase = (willSaveIndex) => {
    // Veriyi JSON formatına çevirme
    const jsonIndex = JSON.stringify(willSaveIndex);
    // Veri tabanına koltukları kayıt etme
    localStorage.setItem("seatIndex", jsonIndex);
    localStorage.setItem("movieIndex", JSON.stringify(movieSelect.selectedIndex));
};

const getFromDataBase = () => {
    const dbSelectedIndex = JSON.parse(localStorage.getItem("seatIndex"));

    if(dbSelectedIndex !== null) {
        allSeats.forEach((seat,index) => {
            if (dbSelectedIndex.includes(index)) {
                seat.classList.add("selected");
            }
        });
    }
    const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));
    movieSelect.selectedIndex = dbSelectedMovie;
};

getFromDataBase();

// koltukları bir dizi gibi sayıp numaralandırma
const createIndex = () => {
    // dizi oluşturma
    const allSeatsArray = [];
    // her gezdiğin koltuğu yukardaki diziye yazma
    allSeats.forEach((seat) => { 
        allSeatsArray.push(seat)
    });
    const allSelectedSeatsArray = [];
    const selectedSeats = container.querySelectorAll(".seat.selected");
    selectedSeats.forEach((selectedSeat) => {
        allSelectedSeatsArray.push(selectedSeat);
    });
    // Tüm koltujları seçme
    const selectedIndex = allSelectedSeatsArray.map((selectedSeat) => {
        // Seçilen koltuğun kaçıncı numara olmasını bulma
        return allSeatsArray.indexOf(selectedSeat);
      });
      saveToDatabase(selectedIndex);
};

// Toplam fiyat hesaplama fonksiyonu
function calculateTotal() {
    // koltuğun seçili olup olmadığını kontrol etme
    const selectedSeatCounts = container.querySelectorAll(".seat.selected").length;
    // İnfo Text kısmındaki koltuk sayısını belirleme
    totalSeatCount.innerText = selectedSeatCounts;
    // optionda bulunan film seçeneklerini seçme
    let selectedMoviePrice = movieSelect.options[movieSelect.selectedIndex].value;
    // infotext kısmında yazılan fiyatı belirleme
    totalPrice.innerText = selectedSeatCounts * selectedMoviePrice;
    // koltuk seçince altta ücret bilgi kısmı açılması
    if(selectedSeatCounts){
        infoText.classList.add("open");
    } else {
        infoText.classList.remove("open");
    }
    createIndex();
}
// sayfa yüklendiği gibi çalışması için dışarda çağırıyoruz
calculateTotal();

// koltuğun rezervasyonunu ayarlama ( sarı olup olmama)
container.addEventListener("click", (pointerEvent) => {
    // Tıklanılan yerin kapsayıcısını alma (offsetParent)
    const clickedSeat = pointerEvent.target.offsetParent;

    // basılan koltukları rezervasyonlu koltukları ayarlama
    if(
      clickedSeat.classList.contains("seat") &&
      !clickedSeat.classList.contains("reserve")
      ) {
        clickedSeat.classList.toggle("selected");
      }
      calculateTotal()
});

// Film kısmı değiştiğinde fiyatın değişmesi
movieSelect.addEventListener("change", () => {
    calculateTotal();
});