import { Nav } from "../components/nav";
import { Hero } from "../components/sections/hero";
import { Numbers } from "../components/sections/numbers";
import { Partners } from "../components/sections/partners";
import { Solutions } from "../components/sections/solutions";
import { Editorial } from "../components/sections/editorial";
import { Audience } from "../components/sections/audience";
import { Method } from "../components/sections/method";
import { Showcase } from "../components/sections/showcase";
import { About } from "../components/sections/about";
import { Cta } from "../components/sections/cta";
import { Footer } from "../components/footer";
import { WhatsappFab } from "../components/ui/whatsapp-fab";
import { SheetChrome } from "../components/ui/sheet-chrome";

function Index() {
  return (
    <div id="topo" className="bg-ink">
      <Nav />
      <main>
        <Hero />
        <Numbers />
        <Partners />
        <Solutions />
        <Editorial />
        <Audience />
        <Method />
        <Showcase />
        <About />
        <Cta />
      </main>
      <Footer />
      <WhatsappFab />
      <SheetChrome />
    </div>
  );
}

export default Index;
