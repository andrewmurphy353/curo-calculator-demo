import { Calculator, SeriesAdvance, SeriesPayment, US30360 } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo03() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 3: Solve Unknown Rental, Compute Lessor's XIRR (eXtended Internal Rate of Return)";
  document.getElementById("demoDef1").innerText = "A business enters into a 2-year operating lease for equipment costing 25,000.00. Rentals are due monthly in advance followed by a 15,000.00 purchase option (future value). The lessor's effective annual interest rate is 5.0%. This scenario is illustrated below.";
  (document.getElementById("demoCfd") as HTMLImageElement).src = "./images/demo03.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the unknown rentals and the lessor's XIRR."


  const calc = new Calculator();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Equipment purchase")
      .setAmount(25000.0)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(24)
      .setLabel("Rental")
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(1)
      .setLabel("Purchase option")
      .setAmount(15000.0)
      .build()
  );

  // Calculate the unknown rentals
  const pmtResult = calc.solveValue(new US30360(), 0.05);
  document.getElementById("demoPayment").innerText =
    "Rental result: " + pmtResult.toFixed(calc.precision);

  // Calculate the lessor's XIRR
  const rateDecimal = calc.solveRate(new US30360(undefined, undefined, true));
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Lessor XIRR: " + ratePercent.toFixed(3) + "%  (to 3 decimal places)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "fr-FR").buildSchedule(rateDecimal)
  );
}
