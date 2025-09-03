import Layout from "@/components/layouts/layout"
import HealthWidget from "@/components/pages/dashboard/HealthWidget"
import PageSection from "@/components/PageSection"

export default function Home() {
  return (
    <Layout title="Escritorio Principal">
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <PageSection>
            <HealthWidget />
          </PageSection>
        </div>
      </section>
    </Layout>
  );
}
