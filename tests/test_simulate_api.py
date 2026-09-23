import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.main import app


class SimulateApiTests(unittest.TestCase):
    def test_official_control_scenario(self) -> None:
        payload = {
            "decisions": [
                {"measure_id": "M7", "district_id": "nura"},
                {"measure_id": "M8", "district_id": "nura"},
                {"measure_id": "M10", "district_id": "nura"},
                {"measure_id": "M12", "district_id": None},
                {"measure_id": "M5", "district_id": "saryarka"},
            ]
        }

        with patch("backend.main.get_supabase") as get_supabase, TestClient(app) as client:
            response = client.post("/api/simulate", json=payload)

        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertTrue(result["valid"])
        self.assertEqual(result["budget"]["total_cost"], 95)
        self.assertEqual(result["budget"]["remaining"], 5)
        self.assertAlmostEqual(result["score"]["final"], 56.5, delta=0.1)
        self.assertEqual(result["critical_indicators"]["after_count"], 0)
        self.assertEqual(get_supabase.call_count, 1)  # Application startup only.

    def test_invalid_scenario_returns_engine_validation(self) -> None:
        payload = {"decisions": [{"measure_id": "M7", "district_id": "nura"}]}

        with patch("backend.main.get_supabase"), TestClient(app) as client:
            response = client.post("/api/simulate", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["valid"], False)
        self.assertIn("Exactly 5 decisions are required.", response.json()["errors"])

    def test_cors_allows_local_vite_origin(self) -> None:
        with patch("backend.main.get_supabase"), TestClient(app) as client:
            response = client.options(
                "/api/simulate",
                headers={
                    "Origin": "http://localhost:5173",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "content-type",
                },
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-origin"], "http://localhost:5173")


if __name__ == "__main__":
    unittest.main()
