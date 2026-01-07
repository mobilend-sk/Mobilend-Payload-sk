// app/privacy/page.tsx
import React from 'react';
import './PolicyPage.scss';

export const metadata = {
  title: 'Politika spracúvania osobných údajov - Mobilend.sk',
  description: 'GDPR politika ochrany osobných údajov pre mobilend.sk',
};

export default function PrivacyPolicy() {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <header className="privacy-header">
          <h1>Politika spracúvania osobných údajov</h1>
          <div className="site-name">mobilend.sk</div>
          <div className="date">Dátum účinnosti: [uveďte dátum]</div>
        </header>

        <div className="intro">
          <p>
            Táto Politika spracúvania osobných údajov (ďalej len „Politika") upravuje spôsob
            spracúvania a ochrany osobných údajov používateľov webovej stránky{' '}
            <strong>https://mobilend.sk</strong> v súlade s Nariadením (EÚ) 2016/679 Európskeho
            parlamentu a Rady (GDPR) a zákonom č. 18/2018 Z.z. Slovenskej republiky o ochrane
            osobných údajov.
          </p>
        </div>

        <section>
          <h2>1. Všeobecné ustanovenia</h2>

          <h3>1.1. Prevádzkovateľ osobných údajov</h3>
          <div className="company-info">
            <p>
              <strong>Mobilend s.r.o.</strong>
            </p>
            <p>Sídlo: [uveďte adresu na Slovensku]</p>
            <p>IČO: [uveďte]</p>
            <p>E-mail: info@mobilend.sk</p>
          </div>

          <h3>1.2.</h3>
          <p>
            Prevádzkovateľ zabezpečuje dodržiavanie práv a slobôd fyzických osôb pri spracúvaní ich
            osobných údajov, vrátane ochrany práva na súkromie, v súlade s požiadavkami GDPR.
          </p>

          <h3>1.3.</h3>
          <p>
            Táto Politika sa vzťahuje na všetky informácie, ktoré Prevádzkovateľ získava o
            používateľoch pri používaní webovej stránky <strong>https://mobilend.sk</strong>,
            vrátane realizácie objednávok, prihlásenia na odber noviniek a využívania kontaktných
            formulárov.
          </p>
        </section>

        <section>
          <h2>2. Základné pojmy používané v Politike</h2>
          <ul>
            <li>
              <strong>Osobné údaje</strong> – akékoľvek informácie týkajúce sa identifikovanej alebo
              identifikovateľnej fyzickej osoby (dotknutej osoby).
            </li>
            <li>
              <strong>Spracúvanie osobných údajov</strong> – akákoľvek operácia alebo súbor operácií
              s osobnými údajmi (zber, uchovávanie, zmena, prenos, vymazanie atď.).
            </li>
            <li>
              <strong>Dotknutá osoba</strong> – fyzická osoba, ktorej sa osobné údaje týkajú.
            </li>
            <li>
              <strong>Prevádzkovateľ</strong> – osoba, ktorá určuje účely a prostriedky spracúvania
              osobných údajov.
            </li>
            <li>
              <strong>Sprostredkovateľ</strong> – osoba, ktorá spracúva osobné údaje v mene
              prevádzkovateľa.
            </li>
            <li>
              <strong>Súhlas</strong> – slobodný, konkrétny, informovaný a jednoznačný prejav vôle
              dotknutej osoby so spracúvaním jej osobných údajov.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Zásady spracúvania osobných údajov</h2>
          <p>Prevádzkovateľ spracúva osobné údaje v súlade so zásadami GDPR:</p>
          <ul>
            <li>zákonnosť, spravodlivosť a transparentnosť;</li>
            <li>obmedzenie účelu spracúvania;</li>
            <li>minimalizácia údajov;</li>
            <li>presnosť;</li>
            <li>obmedzenie uchovávania;</li>
            <li>integrita a dôvernosť;</li>
            <li>zodpovednosť prevádzkovateľa.</li>
          </ul>
        </section>

        <section>
          <h2>4. Účely a právne základy spracúvania</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Účel spracúvania</th>
                  <th>Kategórie údajov</th>
                  <th>Právny základ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Spracovanie a plnenie objednávok</td>
                  <td>Meno, priezvisko, adresa, e-mail, telefón, platobné údaje</td>
                  <td>Plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR)</td>
                </tr>
                <tr>
                  <td>Fakturácia, účtovníctvo</td>
                  <td>Meno, adresa, DIČ (ak sa uplatňuje)</td>
                  <td>Právna povinnosť (čl. 6 ods. 1 písm. c))</td>
                </tr>
                <tr>
                  <td>Zákaznícka podpora</td>
                  <td>Kontaktné údaje, história objednávok</td>
                  <td>Oprávnený záujem (čl. 6 ods. 1 písm. f))</td>
                </tr>
                <tr>
                  <td>Analýza návštevnosti (Google Analytics)</td>
                  <td>IP, cookie, session ID</td>
                  <td>Súhlas (čl. 6 ods. 1 písm. a))</td>
                </tr>
                <tr>
                  <td>E-mailové newslettery a ponuky</td>
                  <td>E-mail</td>
                  <td>Súhlas (čl. 6 ods. 1 písm. a))</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>5. Poskytovanie osobných údajov tretím stranám</h2>
          <p>Údaje môžu byť poskytované:</p>
          <ul>
            <li>platobným poskytovateľom (Stripe, GoPay, CardPay a pod.);</li>
            <li>logistickým partnerom na doručenie objednávok;</li>
            <li>spoločnosti Google Ireland Ltd. (služba Google Analytics);</li>
            <li>IT dodávateľom (hosting, vývoj webu).</li>
          </ul>
          <p>
            Prenos údajov tretím stranám sa uskutočňuje iba na základe zmluvy o spracúvaní osobných
            údajov (DPA) podľa čl. 28 GDPR.
          </p>
        </section>

        <section>
          <h2>6. Prenos údajov do tretích krajín</h2>
          <p>
            Prenos osobných údajov mimo EÚ (napr. do USA pri používaní Google Analytics) sa
            uskutočňuje len do krajín s primeranou úrovňou ochrany alebo na základe štandardných
            zmluvných doložiek (Standard Contractual Clauses) schválených Európskou komisiou.
          </p>
        </section>

        <section>
          <h2>7. Uchovávanie údajov</h2>
          <p>Osobné údaje sa uchovávajú len po dobu nevyhnutnú na splnenie účelu spracúvania:</p>
          <ul>
            <li>údaje o objednávkach – 10 rokov (v súlade s daňovou legislatívou SR);</li>
            <li>údaje používateľského účtu – do vymazania účtu;</li>
            <li>analytické údaje – do 2 rokov;</li>
            <li>marketingové údaje – do odvolania súhlasu.</li>
          </ul>
        </section>

        <section>
          <h2>8. Práva dotknutej osoby</h2>
          <div className="rights-list">
            <p>Podľa GDPR má dotknutá osoba právo:</p>
            <ul>
              <li>na prístup k svojim údajom (čl. 15);</li>
              <li>na opravu nepresných údajov (čl. 16);</li>
              <li>na vymazanie („právo byť zabudnutý", čl. 17);</li>
              <li>na obmedzenie spracúvania (čl. 18);</li>
              <li>na prenosnosť údajov (čl. 20);</li>
              <li>namietať proti spracúvaniu (čl. 21);</li>
              <li>odvolať súhlas kedykoľvek.</li>
            </ul>
          </div>

          <div className="contact-box">
            <p>
              <strong>Na uplatnenie svojich práv kontaktujte:</strong>
            </p>
            <p>
              <a href="mailto:gdpr@mobilend.sk">gdpr@mobilend.sk</a>
            </p>
          </div>

          <div className="highlight">
            <p>
              <strong>Sťažnosť je možné podať na:</strong>
              <br />
              Úrad na ochranu osobných údajov Slovenskej republiky
              <br />
              <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer">
                https://dataprotection.gov.sk
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2>9. Bezpečnostné opatrenia</h2>
          <p>
            Prevádzkovateľ uplatňuje technické a organizačné opatrenia na zabezpečenie ochrany
            osobných údajov:
          </p>
          <ul>
            <li>používanie zabezpečených pripojení (HTTPS, SSL);</li>
            <li>kontrola prístupu a autentifikácia;</li>
            <li>pravidelné zálohovanie;</li>
            <li>uzatváranie DPA so sprostredkovateľmi;</li>
            <li>školenia zamestnancov v oblasti ochrany údajov.</li>
          </ul>
        </section>

        <section>
          <h2>10. Súbory cookie a analytika</h2>
          <p>Webová stránka používa súbory cookie na správne funkovanie a analytiku:</p>
          <ul>
            <li>
              <strong>Nevyhnutné cookie</strong> – zabezpečujú funkčnosť košíka a prihlásenie;
            </li>
            <li>
              <strong>Analytické cookie (Google Analytics)</strong> – na analýzu správania
              používateľov;
            </li>
            <li>
              <strong>Marketingové cookie</strong> – používajú sa len so súhlasom používateľa.
            </li>
          </ul>
          <p>
            Používateľ môže zmeniť alebo odvolať svoj súhlas prostredníctvom cookie banneru alebo
            nastavení prehliadača.
          </p>
        </section>

        <section>
          <h2>11. Dôvernosť údajov</h2>
          <p>
            Prevádzkovateľ a všetky osoby, ktoré majú prístup k osobným údajom, sú povinné
            nezverejniť ich tretím stranám bez zákonného dôvodu alebo súhlasu dotknutej osoby.
          </p>
        </section>

        <section>
          <h2>12. Záverečné ustanovenia</h2>

          <h3>12.1.</h3>
          <p>
            Prevádzkovateľ si vyhradzuje právo meniť túto Politiku v prípade zmeny právnych
            predpisov EÚ alebo interných postupov spracúvania údajov.
          </p>

          <h3>12.2.</h3>
          <p>
            Aktuálna verzia Politiky je vždy dostupná na:
            <br />
            <strong>
              <a href="https://mobilend.sk/privacy">https://mobilend.sk/privacy</a>
            </strong>
          </p>

          <h3>12.3.</h3>
          <p>
            Táto Politika nadobúda účinnosť dňom jej zverejnenia a platí až do nahradenia novou
            verziou.
          </p>
        </section>

        <footer className="privacy-footer">
          <p>&copy; 2024 Mobilend s.r.o. Všetky práva vyhradené.</p>
          <p>Tento dokument bol vytvorený v súlade s GDPR a slovenskou legislatívou.</p>
        </footer>
      </div>
    </div>
  );
}