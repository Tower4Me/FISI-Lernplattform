  (function () {
    "use strict";

    var ipInput = document.getElementById("subnet-calc-ip");
    var maskInput = document.getElementById("subnet-calc-mask");
    var baseInput = document.getElementById("subnet-calc-base");
    var nInput = document.getElementById("subnet-calc-n");
    var nHint = document.getElementById("subnet-calc-n-hint");
    var btn = document.getElementById("subnet-calc-btn");
    var errorEl = document.getElementById("subnet-calc-error");
    var resultsEl = document.getElementById("subnet-calc-results");

    var outNet = document.getElementById("subnet-calc-net");
    var outBroadcast = document.getElementById("subnet-calc-broadcast");
    var outFirst = document.getElementById("subnet-calc-first");
    var outLast = document.getElementById("subnet-calc-last");
    var outHosts = document.getElementById("subnet-calc-hosts");
    var outMaskDecimal = document.getElementById("subnet-calc-mask-decimal");
    var outCidr = document.getElementById("subnet-calc-cidr-out");
    var outSubnets = document.getElementById("subnet-calc-subnets");

    var subErrorEl = document.getElementById("subnet-calc-sub-error");
    var subresultEl = document.getElementById("subnet-calc-subresult");
    var subTitle = document.getElementById("subnet-calc-subresult-title");
    var outSubNet = document.getElementById("subnet-calc-sub-net");
    var outSubBroadcast = document.getElementById("subnet-calc-sub-broadcast");
    var outSubFirst = document.getElementById("subnet-calc-sub-first");
    var outSubLast = document.getElementById("subnet-calc-sub-last");
    var outSubHosts = document.getElementById("subnet-calc-sub-hosts");

    var N_HINT_DEFAULT = "Basis-Präfix eingeben, um einzelne Subnetze anzuzeigen.";

    if (!ipInput || !maskInput || !btn) return;

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      resultsEl.hidden = true;
    }

    function toUint32(o1, o2, o3, o4) {
      return ((o1 << 24) | (o2 << 16) | (o3 << 8) | o4) >>> 0;
    }

    function toOctetString(n) {
      return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    }

    function parseIp(raw) {
      var parts = String(raw || "").trim().split(".");
      if (parts.length !== 4) return null;
      var octets = [];
      for (var i = 0; i < 4; i++) {
        if (!/^\d{1,3}$/.test(parts[i])) return null;
        var n = parseInt(parts[i], 10);
        if (n < 0 || n > 255) return null;
        octets.push(n);
      }
      return toUint32(octets[0], octets[1], octets[2], octets[3]);
    }

    function cidrToMaskNum(n) {
      return n === 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0;
    }

    // Prueft, ob eine Maske aus zusammenhaengenden Einsen gefolgt von
    // zusammenhaengenden Nullen besteht (keine "Loecher"), und liefert
    // die passende Praefixlaenge zurueck -- sonst null.
    function maskNumToCidr(maskNum) {
      var seenZero = false;
      var count = 0;
      for (var i = 31; i >= 0; i--) {
        var bit = (maskNum >>> i) & 1;
        if (bit === 1) {
          if (seenZero) return null;
          count++;
        } else {
          seenZero = true;
        }
      }
      return count;
    }

    // Akzeptiert entweder CIDR ("/26", "26") oder Dezimalmaske
    // ("255.255.255.192"). Gibt { cidr, maskNum } zurueck oder null.
    function parseMask(raw) {
      var s = String(raw || "").trim();
      if (!s) return null;

      if (s.indexOf(".") !== -1) {
        var parts = s.split(".");
        if (parts.length !== 4) return null;
        var octets = [];
        for (var i = 0; i < 4; i++) {
          if (!/^\d{1,3}$/.test(parts[i])) return null;
          var n = parseInt(parts[i], 10);
          if (n < 0 || n > 255) return null;
          octets.push(n);
        }
        var maskNum = toUint32(octets[0], octets[1], octets[2], octets[3]);
        var cidr = maskNumToCidr(maskNum);
        if (cidr === null) return { holes: true };
        return { cidr: cidr, maskNum: maskNum };
      }

      var cidrStr = s.charAt(0) === "/" ? s.slice(1) : s;
      if (!/^\d{1,2}$/.test(cidrStr)) return null;
      var cidrNum = parseInt(cidrStr, 10);
      if (cidrNum < 0 || cidrNum > 32) return null;
      return { cidr: cidrNum, maskNum: cidrToMaskNum(cidrNum) };
    }

    // Fuer das optionale Basis-Praefix genuegt eine reine CIDR-Zahl.
    function parseCidrOnly(raw) {
      var s = String(raw || "").trim();
      if (!s) return null;
      var cidrStr = s.charAt(0) === "/" ? s.slice(1) : s;
      if (!/^\d{1,2}$/.test(cidrStr)) return { invalid: true };
      var n = parseInt(cidrStr, 10);
      if (n < 0 || n > 32) return { invalid: true };
      return { cidr: n };
    }

    function calculate() {
      errorEl.hidden = true;
      resultsEl.hidden = true;
      subErrorEl.hidden = true;
      subresultEl.hidden = true;
      nInput.disabled = true;
      nHint.textContent = N_HINT_DEFAULT;

      var ipNum = parseIp(ipInput.value);
      if (ipNum === null) {
        showError("Ungültige IP-Adresse — bitte vier Oktette zwischen 0 und 255 durch Punkte getrennt eingeben (z. B. 192.168.10.42).");
        return;
      }

      var maskResult = parseMask(maskInput.value);
      if (maskResult === null) {
        showError("Ungültige Maske — als CIDR (z. B. /26) oder als Dezimalmaske (z. B. 255.255.255.192) eingeben.");
        return;
      }
      if (maskResult.holes) {
        showError("Ungültige Subnetzmaske — die Bits müssen zusammenhängend sein (keine „Löcher“ wie z. B. 255.0.255.0).");
        return;
      }

      var cidr = maskResult.cidr;
      var maskNum = maskResult.maskNum;

      var netNum = (ipNum & maskNum) >>> 0;
      var broadcastNum = (netNum | (~maskNum >>> 0)) >>> 0;
      var hostBits = 32 - cidr;

      var firstNum, lastNum, hostsLabel;
      if (cidr === 32) {
        firstNum = netNum;
        lastNum = netNum;
        hostsLabel = "1 (/32 = Punktadresse für ein einzelnes Gerät, kein Netz-/Broadcast-Konzept)";
      } else if (cidr === 31) {
        firstNum = netNum;
        lastNum = broadcastNum;
        hostsLabel = "2 (/31 = Punkt-zu-Punkt-Link nach RFC 3021, keine separate Broadcast-Adresse)";
      } else {
        firstNum = (netNum + 1) >>> 0;
        lastNum = (broadcastNum - 1) >>> 0;
        hostsLabel = String(Math.pow(2, hostBits) - 2);
      }

      outNet.textContent = toOctetString(netNum);
      outBroadcast.textContent = (cidr >= 31) ? toOctetString(broadcastNum) + " (siehe Hinweis bei Hosts)" : toOctetString(broadcastNum);
      outFirst.textContent = toOctetString(firstNum);
      outLast.textContent = toOctetString(lastNum);
      outHosts.textContent = hostsLabel;
      outMaskDecimal.textContent = toOctetString(maskNum);
      outCidr.textContent = "/" + cidr;

      var baseResult = parseCidrOnly(baseInput.value);
      var subnetCount = null;
      if (baseResult === null) {
        outSubnets.textContent = "—";
        outSubnets.style.color = "";
      } else if (baseResult.invalid) {
        outSubnets.textContent = "Basis-Präfix muss zwischen 0 und 32 liegen.";
        outSubnets.style.color = "var(--fail)";
      } else if (baseResult.cidr >= cidr) {
        outSubnets.textContent = "Das Basis-Präfix muss kleiner sein als die Maske (/" + cidr + "). Beispiel: Basis /24 bei Maske /26.";
        outSubnets.style.color = "var(--fail)";
      } else {
        subnetCount = Math.pow(2, cidr - baseResult.cidr);
        outSubnets.textContent = String(subnetCount) + " (= 2^(" + cidr + "−" + baseResult.cidr + "))";
        outSubnets.style.color = "";
      }

      if (subnetCount !== null) {
        nInput.disabled = false;
        nHint.textContent = "gültig: 1–" + subnetCount;

        var nRaw = nInput.value.trim();
        if (nRaw !== "") {
          var nVal = Number(nRaw);
          if (!Number.isInteger(nVal) || nVal < 1 || nVal > subnetCount) {
            subErrorEl.textContent = "Es gibt nur " + subnetCount + " Subnetze.";
            subErrorEl.hidden = false;
            subresultEl.hidden = true;
          } else {
            var baseMaskNum = cidrToMaskNum(baseResult.cidr);
            var baseNetNum = (ipNum & baseMaskNum) >>> 0;
            var subnetSize = Math.pow(2, 32 - cidr);
            var startNum = (baseNetNum + (nVal - 1) * subnetSize) >>> 0;
            var subBroadcastNum = (startNum + subnetSize - 1) >>> 0;

            var subFirstNum, subLastNum, subHostsLabel;
            if (cidr === 32) {
              subFirstNum = startNum;
              subLastNum = startNum;
              subHostsLabel = "1 (/32 = Punktadresse für ein einzelnes Gerät, kein Netz-/Broadcast-Konzept)";
            } else if (cidr === 31) {
              subFirstNum = startNum;
              subLastNum = subBroadcastNum;
              subHostsLabel = "2 (/31 = Punkt-zu-Punkt-Link nach RFC 3021, keine separate Broadcast-Adresse)";
            } else {
              subFirstNum = (startNum + 1) >>> 0;
              subLastNum = (subBroadcastNum - 1) >>> 0;
              subHostsLabel = String(subnetSize - 2);
            }

            subTitle.textContent = "Subnetz Nr. " + nVal + " von " + subnetCount;
            outSubNet.textContent = toOctetString(startNum);
            outSubBroadcast.textContent = (cidr >= 31) ? toOctetString(subBroadcastNum) + " (siehe Hinweis bei Hosts)" : toOctetString(subBroadcastNum);
            outSubFirst.textContent = toOctetString(subFirstNum);
            outSubLast.textContent = toOctetString(subLastNum);
            outSubHosts.textContent = subHostsLabel;

            subErrorEl.hidden = true;
            subresultEl.hidden = false;
          }
        }
      }

      resultsEl.hidden = false;
    }

    btn.addEventListener("click", calculate);
    [ipInput, maskInput, baseInput, nInput].forEach(function (el) {
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter") calculate();
      });
    });
  })();
