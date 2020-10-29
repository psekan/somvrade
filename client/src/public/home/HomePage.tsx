import React, { useEffect } from 'react';
import { Link, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import BeforeTestingStepper from './components/BeforeTestingStepper';
import DuringTestingStepper from './components/DuringTestingStepper';
import PlaceInputForm from './components/PlaceInputForm';
import { PlacesContext } from './components/PlacesContext';
import { PlaceType } from './components/PlaceType';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      marginTop: theme.spacing(3),
    },
  }),
);

export function HomePage() {
  const classes = useStyles();
  const [places, setPlaces] = React.useState<PlaceType[]>([]);
  const [placesError, setPlacesError] = React.useState<string | null>(null);

  const refreshPlaces = () => {
    // fetch("/api/places")
    //   .then(res => res.json())
    //   .then(
    //     (result) => {
    //       setPlaces(result);
    //     },
    //     (error) => {
    //       setPlacesError(error);
    //     }
    // )
    setPlacesError(null);
    setPlaces([
      {
        id: 374,
        village: 'Abrah\u00e1m',
        district: 'Abrah\u00e1m ',
        place: 'Kult\u00farny dom',
        created_at: '2020-10-29T11:38:49.000000Z',
        updated_at: '2020-10-29T11:38:49.000000Z',
      },
      {
        id: 558,
        village: 'Abrah\u00e1m',
        district: 'Kult\u00farny dom',
        place: 'Abrah\u00e1m',
        created_at: '2020-10-29T12:19:08.000000Z',
        updated_at: '2020-10-29T12:19:08.000000Z',
      },
      {
        id: 85,
        village: '\u017dilina',
        district: 'Solinky',
        place: 'Z\u0160 Limbov\u00e1 30',
        created_at: '2020-10-29T09:23:16.000000Z',
        updated_at: '2020-10-29T09:23:16.000000Z',
      },
      {
        id: 76,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'CZ\u0160 Romualda Zaymusa 3',
        created_at: '2020-10-29T09:17:05.000000Z',
        updated_at: '2020-10-29T09:17:05.000000Z',
      },
      {
        id: 58,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'Mestsk\u00fd \u00farad',
        created_at: '2020-10-29T09:10:48.000000Z',
        updated_at: '2020-10-29T09:10:48.000000Z',
      },
      {
        id: 56,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'Nov\u00e1 synag\u00f3ga',
        created_at: '2020-10-29T09:10:15.000000Z',
        updated_at: '2020-10-29T09:10:15.000000Z',
      },
      {
        id: 60,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'Spojen\u00e1 \u0161kola Kr\u00e1\u013eovnej pokoja',
        created_at: '2020-10-29T09:12:08.000000Z',
        updated_at: '2020-10-29T09:12:08.000000Z',
      },
      {
        id: 74,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'Stredn\u00e1 priemysel. \u0161kola stavebn\u00e1',
        created_at: '2020-10-29T09:16:03.000000Z',
        updated_at: '2020-10-29T09:16:03.000000Z',
      },
      {
        id: 62,
        village: '\u017dilina',
        district: 'Star\u00e9 mesto',
        place: 'Z\u0160 Holl\u00e9ho 66',
        created_at: '2020-10-29T09:13:29.000000Z',
        updated_at: '2020-10-29T09:13:29.000000Z',
      },
      {
        id: 137,
        village: '\u017dilina',
        district: 'Str\u00e1\u017eov',
        place: 'Marakana',
        created_at: '2020-10-29T09:32:03.000000Z',
        updated_at: '2020-10-29T09:32:03.000000Z',
      },
      {
        id: 45,
        village: 'Zlat\u00e9 Moravce',
        district: 'Zlat\u00e9 Moravce',
        place: 'Mestsk\u00fd \u0161tadi\u00f3n ihrisko',
        created_at: '2020-10-29T09:06:34.000000Z',
        updated_at: '2020-10-29T09:06:34.000000Z',
      },
      {
        id: 55,
        village: 'Zlat\u00e9 Moravce',
        district: 'Zlat\u00e9 Moravce',
        place: 'Slu\u017ebyt mestsk\u00fd podnik',
        created_at: '2020-10-29T09:10:01.000000Z',
        updated_at: '2020-10-29T09:10:01.000000Z',
      },
      {
        id: 57,
        village: 'Zlat\u00e9 Moravce',
        district: 'Zlat\u00e9 Moravce',
        place: 'Stredn\u00e1 odborn\u00e1 \u0161kola technick\u00e1',
        created_at: '2020-10-29T09:10:31.000000Z',
        updated_at: '2020-10-29T09:10:31.000000Z',
      },
      {
        id: 41,
        village: 'Zlat\u00e9 Moravce',
        district: 'Zlat\u00e9 Moravce',
        place: 'Z\u0160 Mojm\u00edrova',
        created_at: '2020-10-29T09:05:33.000000Z',
        updated_at: '2020-10-29T09:05:33.000000Z',
      },
      {
        id: 398,
        village: 'Zvolen ',
        district: 'Podborov\u00e1',
        place: 'SO\u0160 hotelov\u00fdch slu\u017eieb a obchodu, Jablo\u0148ov\u00e1 1351',
        created_at: '2020-10-29T11:46:08.000000Z',
        updated_at: '2020-10-29T11:46:08.000000Z',
      },
      {
        id: 12,
        village: 'Zvolen',
        district: 'Sekier/Lipovec/M\u00f4\u0165ov\u00e1',
        place: 'Futbalov\u00fd \u0161tadi\u00f3n ',
        created_at: '2020-10-29T08:45:59.000000Z',
        updated_at: '2020-10-29T08:45:59.000000Z',
      },
    ]);
  };
  useEffect(refreshPlaces, []);

  return (
    <PlacesContext.Provider value={{ places, error: placesError }}>
      <div style={{ marginTop: '3em', marginBottom: '6em' }}>
        <Typography variant="h1" component="h2">
          Som v rade
        </Typography>
        <Typography variant="h3" component="h4" gutterBottom>
          a chcem pomôcť
        </Typography>
        <Typography variant="body1" gutterBottom>
          Už túto sobotu a nedeľu sa postavíme do radu ku odberovým miestam. Aby sme spoločne
          obmedzili počet ľudí čakajúcich zároveň, informujme sa, koľko ľudí aktuálne čaká pred
          odberovým miestom. Čas, ktorý by sme strávili vonku v skupine ľudí čakaním možno v
          nepriaznivom počasí, budeme môcť stráviť v pohodlí domova.
        </Typography>

        <Typography variant="h5" gutterBottom className={classes.header}>
          Čo je k tomu potrebné?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Stačí, aby ste mali mobilné pripojenie a pri príchode na odberové miesto zadali na túto
          stránku počet ľudí, ktorí čakajú v rade na danom odberovom mieste. Pre Vás je to otázka
          niekoľkých sekúnd, iným to môže ušetriť desiatky minúť až hodín.
        </Typography>

        <Typography variant="h5" gutterBottom className={classes.header}>
          Ako bude stránka fungovať?
        </Typography>
        <Alert severity="warning">
          Ospravedlňujeme sa za momentálne výpadky služby. Služba je v pilotnom testovaní a v
          priebehu dnešného dňa prebehne navýšenie výpočtových zdrojov pre bezproblémový beh počas
          víkendu.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Momentálne je stránka vo vývoji, informácie o samotnom vývoji získate nižšie. Princíp
          fungovania stránky bude ale nasledovný:
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.header}>
          Pred testovaním
        </Typography>
        <BeforeTestingStepper />
        <Typography variant="h6" gutterBottom className={classes.header} id="na-odbernom-mieste">
          Na odbernom mieste
        </Typography>
        <DuringTestingStepper />

        <Typography variant="h5" gutterBottom className={classes.header} id="pridat-odberne-miesto">
          Pridajte odberné miesto
        </Typography>
        <Typography variant="body1" gutterBottom>
          Zoznam odberných miest sa ešte len vytvára. Ak už ale viete, aké odberné miesto bude vo
          Vašej obci, môžete nám pomôcť a pridať ho do systému.
        </Typography>
        <Alert severity="warning">
          Ospravedlňujeme sa za momentálne výpadky služby. Služba je v pilotnom testovaní a v
          priebehu dnešného dňa prebehne navýšenie výpočtových zdrojov pre bezproblémový beh počas
          víkendu.
        </Alert>
        <PlaceInputForm onChange={refreshPlaces} />

        <Typography variant="h5" gutterBottom className={classes.header}>
          Prosba
        </Typography>
        <Typography variant="body1" gutterBottom>
          Šírte odkaz na túto stránku medzi čo najviac ľudí, len tak bude mať zmysel a pomôžeme si
          navzájom.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tiež prosíme o jej sledovanie a informovanie nás, aké odberové miesta budú vo Vašom okolí,
          aby sme ich vopred vložili do databázy.
        </Typography>

        <Typography variant="h5" gutterBottom className={classes.header}>
          Informácie o vývoji stránky
        </Typography>
        <Typography variant="body1" gutterBottom>
          Momentálne je stránka vo vývoji. Vývoj prebieha verejne a môžete ho sledovať na stránke
          &nbsp;
          <Link href="https://github.com/psekan/somvrade">https://github.com/psekan/somvrade</Link>.
          Akékoľvek otázky môžete tiež zasielať na email{' '}
          <Link href="mailto:somvrade@gmail.com">somvrade@gmail.com</Link>
          &nbsp;a budeme radi, ak sa zapojíte a pomôžete nám stránku širiť ďalej, prípadne pomôžete
          s jej vývojom.
        </Typography>
      </div>
    </PlacesContext.Provider>
  );
}
