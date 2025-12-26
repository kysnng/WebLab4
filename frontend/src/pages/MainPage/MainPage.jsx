import React from "react";
import Header from "../../components/Header/Header";
import GraphCanvas from "../../components/GraphCanvas/GraphCanvas";
import ParamsForm from "../../components/ParamsForm/ParamsForm";
import ResultsTable from "../../components/ResultsTable/ResultsTable";

export default function MainPage() {
    return (
        <div className="container">
            <Header />

            <main className="grid">
                <section className="card">
                    <h2 className="card__title">График</h2>
                    <GraphCanvas />
                </section>

                <section className="card">
                    <h2 className="card__title">Параметры</h2>
                    <ParamsForm />
                </section>
            </main>

            <section className="card" style={{ marginTop: "24px" }}>
                <h2 className="card__title">Результаты</h2>
                <ResultsTable />
            </section>
        </div>
    );
}
