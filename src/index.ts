import csvToJson from 'convert-csv-to-json'
import fs from 'fs'

interface Student {
  firstName: string
  surname: string
  VCDSAverage: number
  WorkHabitsAverage: number
  formGroup: string
}

const semesterReportCSV = csvToJson.fieldDelimiter('"')
  .getJsonFromCsv('./csv/SemesterReportAllResultsCsvExport.csv')

const studentResults: Map<string, Student> = new Map()

getStudents().forEach((student) => {
  const VCDSAverage = getVCDSAverage(student)
  let validVCDSAverage = 0

  if (!isNaN(VCDSAverage)) {
    validVCDSAverage = VCDSAverage
  }

  const data = {
    firstName: getFirstName(student),
    surname: getSurname(student),
    VCDSAverage: validVCDSAverage,
    WorkHabitsAverage: getWorkHabitsAverage(student),
    formGroup: getFormGroup(student)
  }

  studentResults.set(student, data)
  console.log(`[ Processed Student: ${student} ]`)
})

fs.writeFileSync('./csv/Student-VCDS-Averages-WorkHabits-Totals.csv', getCSV(studentResults))
console.log('\n[ Finished! Output: ./csv/Student-VCDS-Averages-WorkHabits-Totals.csv ] \n')

function getCSV (sResults: any): string {
  const header = 'StudentCode,FirstName,Surname,FormGroup,VCDSAverage,WorkHabitsAverage'
  let csv = ''

  for (const [key, student] of sResults) {
    csv += String(key) + ','
    csv += String(student.firstName) + ','
    csv += String(student.surname) + ','
    csv += String(student.formGroup) + ','
    csv += String(student.VCDSAverage) + ','
    csv += String(student.WorkHabitsAverage)
    csv += '\n'
  }

  return header + '\n' + csv
}

function getWorkHabitsAverage (studentCode: string): number {
  const results: number[] = []

  semesterReportCSV.forEach((row: any) => {
    if (row.StudentCode === studentCode) {
      results.push(rowHasWorkHabit(row))
    }
  })

  return getTotal(results)
}

function rowHasWorkHabit (row: any): number {
  let workHabitResult = 0

  const workHabitResultValues = new Map()
  workHabitResultValues.set('rarely', 1)
  workHabitResultValues.set('sometimes', 2)
  workHabitResultValues.set('usually', 3)
  workHabitResultValues.set('consistently', 4)

  if (row.AssessmentType === 'Work Habits' && row.Subject !== 'Instrumental Music') {
    const result = row.Result.toLowerCase()

    if (workHabitResultValues.has(result)) {
      workHabitResult = workHabitResultValues.get(result)
    }
  }
  return workHabitResult
}

function getVCDSAverage (studentCode: string): number {
  const results: number[] = []

  semesterReportCSV.forEach((e: any) => {
    if (e.StudentCode === studentCode) {
      const rawResult: number = +e.Result

      if (!isNaN(rawResult)) {
        results.push(rawResult)
      }
    }
  })

  return getAverage(results)
}

function getStudents (): Set<string> {
  const studentCodes: Set<string> = new Set()

  semesterReportCSV.forEach((row: any) => {
    studentCodes.add(row.StudentCode)
    // if (
    //   row.StudentYearLevel === 'Year 7' ||
    //   row.StudentYearLevel === 'Year 8' ||
    //   row.StudentYearLevel === 'Year 9' ||
    //   row.StudentYearLevel === 'Year 10' ||
    //   row.StudentYearLevel === 'Year 11' ||
    //   row.StudentYearLevel === 'Year 12'
    // ) {
    //   studentCodes.add(row.StudentCode)
    // }
  })

  return studentCodes
}

function getFirstName (studentCode: string): string {
  let firstName = ''
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      firstName = row.StudentFirstName
      break
    }
  }
  return firstName
}

function getSurname (studentCode: string): string {
  let surname = ''
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      surname = row.StudentLastName
      break
    }
  }
  return surname
}

function getFormGroup (studentCode: string): string {
  let formGroup = ''
  for (const row of semesterReportCSV) {
    if (row.StudentCode === studentCode) {
      formGroup = row.StudentFormGroup
      break
    }
  }
  return formGroup
}

function getAverage (results: number[]): number {
  const sum: number = results.reduce((a, b) => a + b, 0)
  const average: number = sum / results.length

  return Number(average.toFixed(2))
}

function getTotal (results: number[]): number {
  const sum: number = results.reduce((a, b) => a + b, 0)

  return Number(sum)
}
