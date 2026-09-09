export default {
  rows() {
    const items = AttendanceUserActivity.data?.items || [];
    const branches = BranchMap.branches;
    const statusMap = AttendanceStatusMap.map;

    const findBranch = (departments = []) => {
      for (const [branch, deps] of Object.entries(branches)) {
        if (departments.some(d => deps.includes(d))) {
          return branch;
        }
      }
      return "Nezařazeno";
    };

    return items
      .filter(item => item.attendanceStatus !== "didNotCome")
      .map(item => {
        const deps = (item.person?.departments || []).map(d => d.nameComplete || d.name);
        return {
          firstName: item.person?.firstName || "",
          lastName: item.person?.lastName || "",
          departments: deps.join(", "),
          branch: findBranch(deps),
          shiftName: item.shiftCalendar?.shifts?.[0]?.name || "",
          attendanceStatus: item.attendanceStatus,
          attendanceStatusLabel: statusMap[item.attendanceStatus] || item.attendanceStatus,
          arrivalTime: item.arrivalTime,
          departureTime: item.departureTime
        };
      });
  }
}
