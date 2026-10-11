const welcome = document.querySelector("#welcome");
const invitation = document.querySelector("#invitation");
const openButton = document.querySelector("#open-invitation");
const toast = document.querySelector("#toast");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

openButton.addEventListener("click", () => {
  welcome.hidden = true;
  invitation.hidden = false;
  document.querySelector("#acara").scrollIntoView({ behavior: "smooth" });
});

const eventDate = new Date("2026-10-15T11:00:00+07:00").getTime();
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = eventDate - Date.now();
  if (remaining <= 0) {
    Object.values(countdownFields).forEach((field) => { field.textContent = "00"; });
    return;
  }

  const values = {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
  };
  Object.entries(values).forEach(([unit, value]) => {
    countdownFields[unit].textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

document.querySelector("#share-button").addEventListener("click", async () => {
  const shareData = {
    title: "Undangan Tahlil & Doa Bersama — Hj. Cut Anita",
    text: "Undangan tahlil dan doa bersama mengenang 90 hari wafatnya Almarhumah Hj. Cut Anita.",
    url: window.location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Tautan undangan berhasil disalin.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showToast("Undangan tidak dapat dibagikan saat ini.");
    }
  }
});

document.querySelector("#calendar-button").addEventListener("click", () => {
  const calendarEvent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Online//ID",
    "BEGIN:VEVENT",
    "UID:tahlil-hj-cut-anita-20261015@undangan",
    "DTSTAMP:20261010T000000Z",
    "DTSTART;TZID=Asia/Jakarta:20261015T110000",
    "SUMMARY:Tahlil & Doa Bersama — Hj. Cut Anita",
    "LOCATION:Desa Meunjee, Kec. Glumpang Tiga, Kabupaten Pidie",
    "DESCRIPTION:Mengenang 90 hari wafatnya Almarhumah Hj. Cut Anita binti Teuku M. Daud.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const file = new Blob([calendarEvent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tahlil-hj-cut-anita.ics";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Tanggal acara disimpan ke perangkat Anda.");
});
