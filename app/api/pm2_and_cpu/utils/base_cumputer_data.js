/*
 ~/learnMore/nodejs_performance/nodejs_performace_testing   main !1 ?1                                                                                                                                                              
❯ pm2 -v
7.0.4

  ~/learnMore/nodejs_performance/nodejs_performace_testing   main !1 ?1                                                                                                                                                              
❯ lscpu
Architecture:                x86_64
  CPU op-mode(s):            32-bit, 64-bit
  Address sizes:             46 bits physical, 48 bits virtual
  Byte Order:                Little Endian
CPU(s):                      16
  On-line CPU(s) list:       0-15
Vendor ID:                   GenuineIntel
  Model name:                Intel(R) Core(TM) Ultra 9 285H
    CPU family:              6
    Model:                   197
    Thread(s) per core:      1
    Core(s) per socket:      16
    Socket(s):               1
    Stepping:                2
    BogoMIPS:                7372.80
    Flags:                   fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology tsc_reliable nonstop_tsc cpuid tsc_
                             known_freq pni pclmulqdq vmx ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch ssbd ibrs ibpb stibp ibrs_enhanced tpr_s
                             hadow ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdseed adx smap clflushopt clwb sha_ni xsaveopt xsavec xgetbv1 xsaves avx_vnni vnmi umip waitpkg gfni vaes vpclmulqdq rdpid movdir
                             i movdir64b fsrm md_clear serialize ibt flush_l1d arch_capabilities
Virtualization features:     
  Virtualization:            VT-x
  Hypervisor vendor:         Microsoft
  Virtualization type:       full
Caches (sum of all):         
  L1d:                       768 KiB (16 instances)
  L1i:                       1 MiB (16 instances)
  L2:                        48 MiB (16 instances)
  L3:                        24 MiB (1 instance)
NUMA:                        
  NUMA node(s):              1
  NUMA node0 CPU(s):         0-15
Vulnerabilities:             
  Gather data sampling:      Not affected
  Ghostwrite:                Not affected
  Indirect target selection: Not affected
  Itlb multihit:             Not affected
  L1tf:                      Not affected
  Mds:                       Not affected
  Meltdown:                  Not affected
  Mmio stale data:           Not affected
  Old microcode:             Not affected
  Reg file data sampling:    Not affected
  Retbleed:                  Mitigation; Enhanced IBRS
  Spec rstack overflow:      Not affected
  Spec store bypass:         Mitigation; Speculative Store Bypass disabled via prctl
  Spectre v1:                Mitigation; usercopy/swapgs barriers and __user pointer sanitization
  Spectre v2:                Mitigation; Enhanced / Automatic IBRS; IBPB conditional; PBRSB-eIBRS SW sequence; BHI BHI_DIS_S
  Srbds:                     Not affected
  Tsa:                       Not affected
  Tsx async abort:           Not affected
  Vmscape:                   Not affected

  ~/learnMore/nodejs_performance/nodejs_performace_testing   main !1 ?1                                                                                                                                                              
❯ nproc
16

  ~/learnMore/nodejs_performance/nodejs_performace_testing   main !1 ?1                                                                                                                                                              
❯ free -h
               total        used        free      shared  buff/cache   available
Mem:            31Gi       2.8Gi        27Gi       6.2Mi       1.5Gi        28Gi
Swap:          8.0Gi          0B       8.0Gi

  ~/learnMore/nodejs_performance/nodejs_performace_testing   main !1 ?1                                                                                                                                                              
❯ node -e "const os=require('node:os'); console.log({
  cpus: os.cpus().length,
  available: os.availableParallelism()
})"
{ cpus: 16, available: 16 }
*/