namespace Fanex.NAP.Licensee.AppStart
{
    using Infrastructure;
    using Quartz;
    using Quartz.Impl;

    public static class BackgroundJobScheduler
    {
        public static void Start()
        {
            const int period = 4;
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();
            scheduler.Start();

            IJobDetail job = JobBuilder.Create<BackgroundJob>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("Check expried pass", "user")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInHours(period).RepeatForever())
                .Build();

            scheduler.ScheduleJob(job, trigger);
        }
    }
}