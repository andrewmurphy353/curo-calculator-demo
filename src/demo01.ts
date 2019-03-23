import { Calculator, Mode, SeriesAdvance, SeriesPayment, SeriesCharge, US30360, EU200848EC } from "@curo/calculator";
import ScheduleBuilder from "../schedule-builder";

export default function runDemo01() {

  // Problem definition
  document.getElementById("demoTitle").innerText = "DEMO 1: Solve Unknown Payment, Compute Borrower's APR (Annual Percentage Rate)";
  document.getElementById("demoDef1").innerText = "An individual has applied for a loan of 10,000.00, repayable by 6 monthly instalments in arrears. A fee of 50.0 is payable with the first instalment. The lender's effective annual interest rate is 8.25%. This scenario is illustrated below.";
  (<HTMLImageElement>document.getElementById("demoCfd")).src = "./assets/images/demo01.png";
  document.getElementById("demoDef2").innerText = "Using the US 30/360 day count convention, compute the value of the unknown instalments/payments and the borrower's APR."


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
      .setNumberOf(6)
      .setLabel("Instalment")
      .setMode(Mode.Arrear)
      .build()
  );
  calc.add(
    SeriesCharge.builder()
      .setLabel("Fee")
      .setAmount(50.0)
      .setMode(Mode.Arrear)
      .build()
  );

  // Calculate the unknown payment
  const pmtResult = calc.solveValue(new US30360(), 0.0825);
  document.getElementById("demoPayment").innerText = "Payment result: " + pmtResult.toFixed(calc.precision);

  // Calculate the borrower's APR
  // - for loans taken out in EU member state
  const rateDecimal = calc.solveRate(new EU200848EC());
  // - for loans taken out in rest of world you could produce
  //   a similar result using the XIRR feature of the provided
  //   day count convention
  // const rateDecimal = calc.solveRate(new US30360(undefined, true, true));
  const ratePercent = rateDecimal * 100;
  document.getElementById("demoRate").innerText =
    "Borrower APR: " + ratePercent.toFixed(1) + "%  (to 1 decimal place)";

  // Display the results in a schedule
  document.getElementById("demoSchedule").appendChild(
    new ScheduleBuilder(calc.profile, "en-IE").buildSchedule(rateDecimal)
  );
}
