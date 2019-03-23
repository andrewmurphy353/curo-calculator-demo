import { Calculator, Mode, SeriesAdvance, SeriesPayment, US30360 } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo08() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 8:** Solve Unknown Rental, Loaded First Rental";
  document.getElementById("demoDef1").innerText = "A business enters into a 3-year finance lease for equipment costing 10,000.00. Rentals are due monthly with the first 3 rentals due upfront, followed by the remaining 33 monthly rentals due in arrears. The lessor's effective annual interest rate is 7.0%. This scenario is illustrated below.";
  (<HTMLImageElement>document.getElementById("demoCfd")).src = "./assets/images/demo08.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the unknown rental and the lessor's IRR."


  const calc = new Calculator();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Equipment cost")
      .setAmount(10000.0)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(1)
      .setLabel("Initial rental")
      .setWeighting(3.0) // 3x the unknown fully weighted payment value
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(33)
      .setLabel("Rental")
      .setMode(Mode.Arrear)
      .setWeighting(1.0) // 1x the unknown fully weighted payment value
      .build()
  );

  // Calculate the unknown rental (fully weighted)
  const pmtResult = calc.solveValue(new US30360(), 0.07);
  document.getElementById("demoPayment").innerText =
    "Rental result: " + pmtResult.toFixed(calc.precision);

  // Calculate the lessor's IRR
  const rateDecimal = calc.solveRate(new US30360());
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Lessor IRR: " + ratePercent.toFixed(3) + "%  (to 3 decimal places)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
