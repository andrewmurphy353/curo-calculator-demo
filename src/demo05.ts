import { Calculator, Mode, SeriesAdvance, SeriesPayment, US30360 } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo05() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 5: Compute Supplier Contribution, 0% Interest Finance Promotion";
  document.getElementById("demoDef1").innerText = "A car dealership offers an individual 0% finance on a car costing 20,400.00. An upfront deposit of 6000.00 is payable, followed by 36 monthly instalments of 400.00 in arrears. Finance is provided by a third party lender at an effective annual interest rate of 5.0%. The supplier agrees with the lender to make an *undisclosed* contribution to cover the cost of finance. This scenario is illustrated below.";
  (<HTMLImageElement>document.getElementById("demoCfd")).src = "./assets/images/demo05.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the contribution and lender's IRR."


  const calc = new Calculator();
  const today = new Date();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Cost of car")
      .setAmount(20400.0)
      .setDrawdownFrom(today)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(1)
      .setLabel("Deposit")
      .setAmount(6000.0)
      .setDueOnOrFrom(today)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(1)
      .setLabel("Supplier contribution")
      .setDueOnOrFrom(today)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(36)
      .setLabel("Instalment")
      .setAmount(400.0)
      .setMode(Mode.Arrear)
      .setDueOnOrFrom(today)
      .build()
  );

  // Calculate the supplier contribution
  const pmtResult = calc.solveValue(new US30360(), 0.05);
  document.getElementById("demoPayment").innerText =
    "Supplier contribution: " + pmtResult.toFixed(calc.precision);

  // Calculate the lender's IRR
  const rateDecimal = calc.solveRate(new US30360());
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Lender IRR: " + ratePercent.toFixed(3) + "%  (to 3 decimal places)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
