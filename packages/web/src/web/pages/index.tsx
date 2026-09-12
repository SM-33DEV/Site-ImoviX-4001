import { Hero } from "../components/sections/hero";
import { Numbers } from "../components/sections/numbers";
import { Partners } from "../components/sections/partners";
import {
  StudioNav,
  StudioSolutions,
  StudioProjects,
  StudioAbout,
  StudioContact,
  StudioFooter,
} from "../components/studio";
import "../studio.css";

function Index() {
  return (
    <div id="topo" className="studio">
      <main>
        <Hero />
        <StudioNav />
        <Numbers />
        <Partners />
        <StudioSolutions />
        <StudioProjects />
        <StudioAbout />
        <StudioContact />
      </main>
      <StudioFooter />
    </div>
  );
}

export default Index;
