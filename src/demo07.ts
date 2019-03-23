import { Calculator, Mode, SeriesAdvance, SeriesPayment, US30360, EU200848EC } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo07() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 7: Solve Unknown Payment, Stepped Repayment Profile";
  document.getElementById("demoDef1").innerText = "An individual secures a loan of 10,000.00 repayable by 36 monthly instalments in arrears on a stepped profile. The instalments payable in each successive year are to be stepped at the ratio 1.0 : 0.6 : 0.4 to accelerate capital recovery in earlier years. The lender's effective annual interest rate is 7.0%. This scenario is illustrated below.";
  (<HTMLImageElement>document.getElementById("demoCfd")).src = "./assets/images/demo07.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the unknown (fully weighted) instalment and the borrower's APR."


  const calc = new Calculator();

  // Define the cash flow series
  calc.add(
    SeriesAdvance.builder()
      .setLabel("Loan advance")
      .setAmount(10000.0)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(12)
      .setLabel("Instalment")
      .setMode(Mode.Arrear)
      .setWeighting(1.0) // 100% of the unknown payment value (fully weighted)
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(12)
      .setLabel("Instalment")
      .setMode(Mode.Arrear)
      .setWeighting(0.6) // 60% of the unknown payment value
      .build()
  );
  calc.add(
    SeriesPayment.builder()
      .setNumberOf(12)
      .setLabel("Instalment")
      .setMode(Mode.Arrear)
      .setWeighting(0.4) // 40% of the unknown payment value
      .build()
  );

  // Calculate the unknown payment (fully weighted)
  const pmtResult = calc.solveValue(new US30360(), 0.07);
  document.getElementById("demoPayment").innerText =
    "Payment result (fully weighted): " + pmtResult.toFixed(calc.precision);

  // Calculate the borrower's APR
  // - for loans taken out in EU member state
  const rateDecimal = calc.solveRate(new EU200848EC());
  // - for loans taken out in rest of world you could produce
  //   a similar result using the XIRR feature of the provided
  //   day count convention
  // const rateDecimal = calc.solveRate(new US30360(undefined, undefined, true));
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Borrower APR: " + ratePercent.toFixed(1) + "%  (to 1 decimal place)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
