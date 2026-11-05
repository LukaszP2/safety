// Klasa, która mówi Home Assistantowi, JAK ułożyć kafelki na pulpicie
class SafetyDashboardStrategy extends HTMLElement {
  static async generateDashboard(info) {
    // info.hass zawiera pełną wiedzę o encjach w systemie
    const hass = info.hass;
    
    // Zwracamy gotową strukturę Lovelace Dashboard
    return {
      title: "Bezpieczeństwo Domu",
      views: [
        {
          title: "Status Systemu",
          icon: "mdi:shield-check",
          cards: [
            {
              type: "markdown",
              content: "# 🛡️ System Safety\nAutomatycznie wygenerowany pulpit z Twoimi czujnikami."
            },
            {
               type: "entities",
               title: "Wykryte Zagrożenia",
               show_header_toggle: false,
               // Tutaj w przyszłości możemy pętlą mapować encje z Twojego coordinator.category_config!
               entities: [
                 "sensor.safety_central_hub", // Główny sensor z Twojego Pythona
               ]
            }
          ]
        }
      ]
    };
  }
}

// 1. Zarejestrowanie elementu w przeglądarce
customElements.define("ll-strategy-dashboard-safety", SafetyDashboardStrategy);

// 2. NOWOŚĆ Z ARTYKUŁU: Rejestracja pięknej wizytówki w interfejsie HA
window.customStrategies = window.customStrategies || [];
window.customStrategies.push({
  type: "safety",                    // Klucz, którego HA użyje by znaleźć "ll-strategy-dashboard-safety"
  strategyType: "dashboard",
  name: "Safety Manager",
  description: "Automatyczny, bezobsługowy pulpit dla Twojego systemu bezpieczeństwa.",
});