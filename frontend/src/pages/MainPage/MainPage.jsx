import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import GraphCanvas from "../../components/GraphCanvas/GraphCanvas";
import ParamsForm from "../../components/ParamsForm/ParamsForm";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import { loadResultsThunk } from "../../store/results/resultsThunks";
import "../../styles/style.css";

export default function MainPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadResultsThunk());
    }, [dispatch]);

    return (
        <div className="container">
            <main className="grid">
                <Header />
                <section className="card">
                    <h2 className="card__title">График</h2>
                    <GraphCanvas />
                </section>

                <section className="card">
                    <h2 className="card__title">Параметры</h2>
                    <ParamsForm />
                </section>

                <section className="card" style={{ marginTop: "24px" }}>
                    <h2 className="card__title">Результаты</h2>
                    <ResultsTable />
                </section>
            </main>
        </div>
    );
}
