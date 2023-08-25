import { Calculator, Mode, SeriesAdvance, SeriesPayment, ActISDA } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo02() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 2: Solve Unknown Rental, Compute Lessor's IRR (Internal Rate of Return)";
  document.getElementById("demoDef1").innerText = "A business enters into a 3-year finance lease for equipment costing 15,000.00. Rentals are due monthly in advance. The lessor's effective annual interest rate is 6.0%. This scenario is illustrated below.";
  (document.getElementById("demoCfd") as HTMLImageElement).src = "./images/demo02.png";
  document.getElementById("demoDef2").innerText = "Using the Actual/Actual (ISDA) day count convention, compute the value of the unknown rentals and the lessor's IRR."


  const calc = new Calculator();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Equipment purchase")
      .setAmount(15000.0)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(36)
      .setLabel("Rental")
      .setMode(Mode.Advance) // No need to define as this is the default
      .build()
  );

  // Calculate the unknown rentals
  const pmtResult = calc.solveValue(new ActISDA(), 0.06);
  document.getElementById("demoPayment").innerText =
    "Rental result: " + pmtResult.toFixed(calc.precision);

  // Calculate the lessor's IRR
  const rateDecimal = calc.solveRate(new ActISDA());
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Lessor IRR: " + ratePercent.toFixed(3) + "%  (to 3 decimal places)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
